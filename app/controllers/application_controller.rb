class ApplicationController < ActionController::Base
  protect_from_forgery
  
  include ApplicationHelper
  
  def check_user_agent
    if @user_agent.blank?
      @user_agent = MobileESP::UserAgentInfo.new user_agent(request), accept(request)
      @is_ios = @user_agent.is_iphone || @user_agent.detect_ipad
    end
  end
  
  def ios?
    check_user_agent
    @is_ios
  end
  
end
