class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :check_user_agent
  
  include ApplicationHelper
  
  def check_user_agent
    if @user_agent.blank?
      user_agent = user_agent(request)
      logger.info 'UA: ' + user_agent.inspect
      @user_agent = MobileESP::UserAgentInfo.new user_agent, accept(request)
      @is_ios = @user_agent.is_iphone || @user_agent.detect_ipad
    end
  end
  
  def ios?
    check_user_agent
    @is_ios
  end
  
end
