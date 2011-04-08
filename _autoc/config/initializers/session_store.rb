# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '__autoc_session',
  :secret      => '5d05a5fb5e173d3ee9d676fe4d7c8592167be76d9e7f3ce33e507566cf5aff8673163c80e77c228915f2a79a5a6434d25bff3cb30458a61b798dc1affe822336'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
