require 'uri'

class TwitterLogic
  def self.tweet status, access_token, access_token_secret
    client(access_token, access_token_secret).update status
  rescue => e
    puts e.to_s
    puts e.backtrace[0..10].join("\n")
  end
             
  def self.client access_token, access_token_secret
    options = {consumer_key: ENV['CONSUMER_KEY'], consumer_secret: ENV['CONSUMER_SECRET'], oauth_token: access_token, oauth_token_secret: access_token_secret}
    if ENV['http_proxy'].present?
      uri = URI.parse ENV['http_proxy']
      options[:connection_options] = {proxy: {uri: uri.scheme+'://'+uri.host+':'+uri.port.to_s, user: uri.user, password: uri.password}}
    end
    Twitter::Client.new options
  end
end
