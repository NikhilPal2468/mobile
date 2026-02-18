#!/bin/bash
# Fix CocoaPods to use system Ruby instead of JRuby

# Unset RVM variables
unset GEM_HOME GEM_PATH
unset rvm_bin_path rvm_path rvm_prefix rvm_version

# Use system Ruby
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.gem/ruby/2.6.0/bin:$PATH"

# Install CocoaPods with system Ruby if not already installed
if ! command -v pod &> /dev/null; then
  echo "Installing CocoaPods with system Ruby..."
  /usr/bin/gem install cocoapods --user-install
fi

# Verify pod works
echo "Checking CocoaPods installation..."
pod --version

echo "✅ CocoaPods is ready. You can now run: npx expo run:ios"
