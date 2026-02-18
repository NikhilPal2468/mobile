#!/bin/bash
# Install CocoaPods dependencies with correct Ruby

set -e

echo "🔧 Setting up Ruby environment for pod install..."

# Completely unset RVM to avoid JRuby
unset GEM_HOME GEM_PATH
unset rvm_bin_path rvm_path rvm_prefix rvm_version
unset MY_RUBY_HOME IRBRC

# Remove RVM from PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v rvm | tr '\n' ':' | sed 's/:$//')

# Try Homebrew Ruby first, then system Ruby
if [ -f "/usr/local/opt/ruby/bin/ruby" ]; then
    RUBY_BIN="/usr/local/opt/ruby/bin"
    export PATH="$RUBY_BIN:$PATH"
    echo "✅ Using Homebrew Ruby: $(/usr/local/opt/ruby/bin/ruby --version)"
elif [ -f "/opt/homebrew/opt/ruby/bin/ruby" ]; then
    RUBY_BIN="/opt/homebrew/opt/ruby/bin"
    export PATH="$RUBY_BIN:$PATH"
    echo "✅ Using Homebrew Ruby (Apple Silicon): $(/opt/homebrew/opt/ruby/bin/ruby --version)"
else
    RUBY_BIN="/usr/bin"
    export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
    echo "⚠️  Using system Ruby: $(/usr/bin/ruby --version)"
fi

# Verify Ruby (should NOT be JRuby)
RUBY_VERSION=$(ruby --version)
if echo "$RUBY_VERSION" | grep -q "jruby"; then
    echo "❌ ERROR: Still using JRuby! Please check your shell configuration."
    echo "Current Ruby: $RUBY_VERSION"
    exit 1
fi

# Check if kconv is available (Ruby 4.0+ removed it)
if ! ruby -e "require 'kconv'" 2>/dev/null; then
    RUBY_MAJOR=$(ruby -e 'puts RUBY_VERSION.split(".")[0].to_i')
    RUBY_MINOR=$(ruby -e 'puts RUBY_VERSION.split(".")[1].to_i')
    if [ "$RUBY_MAJOR" -ge 4 ] || ([ "$RUBY_MAJOR" -eq 3 ] && [ "$RUBY_MINOR" -ge 2 ]); then
        echo ""
        echo "❌ ERROR: kconv library not available"
        echo ""
        echo "CocoaPods requires 'kconv' which was removed in Ruby 3.2+."
        echo "Your Ruby version: $RUBY_VERSION"
        echo ""
        echo "Solution: Install Ruby 3.1"
        echo "  brew install ruby@3.1"
        echo "  export PATH=\"/usr/local/opt/ruby@3.1/bin:\$PATH\""
        echo ""
        exit 1
    fi
fi

# Get gem directory
GEM_USER_DIR=$(ruby -e "require 'rubygems'; puts Gem.user_dir" 2>/dev/null)
if [ -n "$GEM_USER_DIR" ] && [ -d "$GEM_USER_DIR" ]; then
    GEM_BIN_PATH="$GEM_USER_DIR/bin"
    export PATH="$GEM_BIN_PATH:$PATH"
fi

# Install CocoaPods if not available
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    gem install cocoapods --user-install
    GEM_USER_DIR=$(ruby -e "require 'rubygems'; puts Gem.user_dir" 2>/dev/null)
    if [ -n "$GEM_USER_DIR" ]; then
        export PATH="$GEM_USER_DIR/bin:$PATH"
    fi
fi

echo "✅ CocoaPods ready: $(pod --version)"
echo ""
echo "📦 Installing Pods..."
echo ""

# Run pod install
pod install

echo ""
echo "✅ Pods installed successfully!"
echo ""
echo "Now you can:"
echo "1. Open ios/SchoolAdmission.xcworkspace in Xcode"
echo "2. Or run: npx expo run:ios"
