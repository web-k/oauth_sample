module ApplicationHelper
 
  def user_agent(request)
    request.headers['HTTP_USER_AGENT']
  end

  def accept(request)
    request.headers['HTTP_ACCEPT']
  end
  
end
