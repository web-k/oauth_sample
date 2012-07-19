#Twitter.configure do |config|
#  config.proxy = ENV['HTTP_PROXY']
#end

class TwitterLogic
  def self.tweet status, access_token, access_token_secret
    client(access_token, access_token_secret).update status rescue nil
  end
             
  def self.client access_token, access_token_secret
    Twitter.new consumer_key: ENV['CONSUMER_KEY'], consumer_secret: ENV['CONSUMER_SECRET'], oauth_token: access_token, oauth_token_secret: access_token_secret
  end
end
