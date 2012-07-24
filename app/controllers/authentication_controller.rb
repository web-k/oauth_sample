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
      session['account'] = @user_info['screen_name']
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
end
