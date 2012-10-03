class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :check_user_agent
  before_filter :check_request_headers
  before_filter :ua_logging
  
  include ApplicationHelper
  
  def ua_logging
    logger.info('  UA: ' + request.env['HTTP_USER_AGENT'].inspect)
  end

  def check_user_agent
    if @user_agent.blank?
      user_agent = user_agent(request)
      @user_agent = MobileESP::UserAgentInfo.new user_agent, accept(request)
      @is_ios = @user_agent.is_iphone || @user_agent.detect_ipad
    end
  end
  
  def check_request_headers
    logger.info 'Headers:'
    user_agent = user_agent(request)
    logger.info '  User-Agent: ' + user_agent.inspect
    logger.info '  Accept: ' + request.headers['Accept'].inspect
    logger.info '  Accept-Language: ' + request.headers['Accept-Language'].inspect
    logger.info '  Accept-Encoding: ' + request.headers['Accept-Encoding'].inspect
    logger.info '  Cache-Control: ' + request.headers['Cache-Control'].inspect
  end

  def ios?
    check_user_agent
    @is_ios
  end
  
end
