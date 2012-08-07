class AuthenticationController < ApplicationController

  def self.consumer
    consumer_key = ENV['CONSUMER_KEY']
    consumer_secret = ENV['CONSUMER_SECRET'] 
    consumer_option = {:site => "http://twitter.com"}
    consumer_option[:proxy] = ENV['http_proxy'] if ENV['http_proxy'].present?
    consumer = OAuth::Consumer.new(
      consumer_key, consumer_secret,
      consumer_option
    )
  end
 
  def index
  end
 
  def oauth
    # :oauth_callbackに認証後のコールバックURLを指定
    # この場合だとこのコントローラー内の oauth_callback メソッドが実行される
    request_token = AuthenticationController.consumer.get_request_token(
      :oauth_callback => "http://#{request.host_with_port}/oauth_callback"
    )
    session[:request_token] = request_token.token
    session[:request_token_secret] = request_token.secret
    # twitter.comで認証する
    redirect_to request_token.authorize_url
    return
  end
 
  def oauth_callback
    consumer = AuthenticationController.consumer
    request_token = OAuth::RequestToken.new(
      consumer,
      session[:request_token],
      session[:request_token_secret]
    )
 
    access_token = request_token.get_access_token(
      {},
      :oauth_token => params[:oauth_token],
      :oauth_verifier => params[:oauth_verifier]
    )

    response = consumer.request(
      :get,
      '/account/verify_credentials.json',
      access_token, { :scheme => :query_string }
    )
    case response
    when Net::HTTPSuccess
      @user_info = JSON.parse(response.body)
      unless @user_info['screen_name']
        flash[:notice] = "Authentication failed"
        redirect_to :action => :index
        return
      end
      session['account_name'] = @user_info['screen_name']
      session['account_image_url'] = @user_info['profile_image_url']
      session['access_token'] = access_token.token
      session['access_token_secret'] = access_token.secret
      redirect_to root_path
    else
      RAILS_DEFAULT_LOGGER.error "Failed to get user info via OAuth"
      flash[:notice] = "Authentication failed"
      redirect_to :action => :index
      return
    end
  end

  def logout
    reset_session
    redirect_to :action => :index
  end

  def fb_login
    client = OAuth2::Client.new(
      ENV['FB_CONSUMER_KEY'],
      ENV['FB_CONSUMER_SECRET'],
      :site=>"https://graph.facebook.com",
      :token_url => "/oauth/access_token"
    )
    options ={:client_id => ENV['FB_CONSUMER_KEY'], :redirect_uri => url_for(:host => request.host, :action => "fb_callback"), :scope => 'offline_access,publish_stream'}
    redirect_to client.auth_code.authorize_url(options)
  end

  def fb_callback
    options = {:site=>"https://graph.facebook.com", :token_url => "/oauth/access_token"}
    if ENV['http_proxy'].present?
      uri = URI.parse ENV['http_proxy']
      options[:connection_opts] = {proxy: {uri: uri.scheme+'://'+uri.host+':'+uri.port.to_s, user: uri.user, password: uri.password}}
    end
    client = OAuth2::Client.new(
      ENV['FB_CONSUMER_KEY'],
      ENV['FB_CONSUMER_SECRET'],
      options
    )
    begin
      access_token = client.auth_code.get_token(params[:code], {:parse => :query, :redirect_uri => url_for(:host => request.host, :action => "fb_callback")})
      session['fb_access_token'] = access_token.token
      token = OAuth2::AccessToken.new(client, session['fb_access_token'], :mode => :query, :param_name => :access_token)
      me = token.get("/me").parsed
      user_icon = token.get("/me?fields=picture").parsed
      session['fb_user_icon_url'] = user_icon['picture']['data']['url']
      session['account_name'] = me["name"]
    rescue
      flash[:notice] = "Authentication failed"
    end
    redirect_to root_path
  end
end
