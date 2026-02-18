#!/bin/bash
# Fixed script to run Expo iOS build with proper Ruby

set -e

echo "🔧 Fixing Ruby environment for CocoaPods..."

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

echo "✅ Ruby version: $RUBY_VERSION"

# Check if kconv is available (Ruby 4.0+ removed it, CocoaPods needs it)
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
        echo "Solutions:"
        echo "1. Use Ruby 3.1: brew install ruby@3.1 && export PATH=\"/usr/local/opt/ruby@3.1/bin:\$PATH\""
        echo "2. Use Expo Prebuild: npx expo prebuild (then open in Xcode)"
        echo "3. Use EAS Build: npm install -g eas-cli && eas build --platform ios"
        echo ""
        echo "See mobile/RUBY_KCONV_FIX.md for details."
        exit 1
    fi
fi

# Get actual gem directory from RubyGems (more reliable than constructing path)
GEM_USER_DIR=$(ruby -e "require 'rubygems'; puts Gem.user_dir" 2>/dev/null)
if [ -n "$GEM_USER_DIR" ] && [ -d "$GEM_USER_DIR" ]; then
    GEM_BIN_PATH="$GEM_USER_DIR/bin"
    RUBY_VER=$(basename "$GEM_USER_DIR")
else
    # Fallback: try to construct path
    RUBY_VER=$(ruby -e 'v=RUBY_VERSION.split("."); puts v[0..2].join(".")')
    GEM_BIN_PATH="$HOME/.gem/ruby/$RUBY_VER/bin"
    if [ ! -d "$GEM_BIN_PATH" ]; then
        RUBY_VER_SHORT=$(ruby -e 'v=RUBY_VERSION.split("."); puts v[0..1].join(".")')
        GEM_BIN_PATH="$HOME/.gem/ruby/$RUBY_VER_SHORT/bin"
    fi
fi

# Add gem bin to PATH BEFORE checking for pod
export PATH="$GEM_BIN_PATH:$PATH"

# Install CocoaPods if not available
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    gem install cocoapods --user-install || {
        echo "⚠️  Installing older CocoaPods version for compatibility..."
        gem install cocoapods -v 1.11.3 --user-install
    }
    # Re-add gem bin to PATH after installation (recalculate path)
    GEM_USER_DIR=$(ruby -e "require 'rubygems'; puts Gem.user_dir" 2>/dev/null)
    if [ -n "$GEM_USER_DIR" ] && [ -d "$GEM_USER_DIR" ]; then
        GEM_BIN_PATH="$GEM_USER_DIR/bin"
        RUBY_VER=$(basename "$GEM_USER_DIR")
    else
        RUBY_VER=$(ruby -e 'v=RUBY_VERSION.split("."); puts v[0..2].join(".")')
        GEM_BIN_PATH="$HOME/.gem/ruby/$RUBY_VER/bin"
        if [ ! -d "$GEM_BIN_PATH" ]; then
            RUBY_VER_SHORT=$(ruby -e 'v=RUBY_VERSION.split("."); puts v[0..1].join(".")')
            GEM_BIN_PATH="$HOME/.gem/ruby/$RUBY_VER_SHORT/bin"
        fi
    fi
    export PATH="$GEM_BIN_PATH:$PATH"
fi

# Verify pod is available
if ! command -v pod &> /dev/null; then
    echo "❌ ERROR: pod command not found after installation"
    echo "Gem bin path: $GEM_BIN_PATH"
    echo "Current PATH: $PATH"
    ls -la "$GEM_BIN_PATH" 2>/dev/null || echo "Gem bin directory does not exist"
    exit 1
fi

echo "✅ CocoaPods ready: $(pod --version)"
echo "✅ Using Ruby: $(ruby --version)"
echo "✅ Pod location: $(which pod)"
echo ""
echo "🚀 Running Expo iOS build with fixed Ruby environment..."
echo ""

# Export environment variables so Expo can use them
# Use the actual gem directory from RubyGems
GEM_USER_DIR=$(ruby -e "require 'rubygems'; puts Gem.user_dir" 2>/dev/null)
if [ -n "$GEM_USER_DIR" ]; then
    export GEM_HOME="$GEM_USER_DIR"
    export GEM_PATH="$GEM_HOME"
else
    GEM_HOME_DIR=$(dirname "$GEM_BIN_PATH")
    export GEM_HOME="$GEM_HOME_DIR"
    export GEM_PATH="$GEM_HOME"
fi
export PATH="$GEM_BIN_PATH:$PATH"

# Run Expo with the fixed environment
# Use env to explicitly pass environment variables to subprocesses
env PATH="$PATH" GEM_HOME="$GEM_HOME" GEM_PATH="$GEM_PATH" \
    RUBY_ROOT="$RUBY_BIN" \
    npx expo run:ios
