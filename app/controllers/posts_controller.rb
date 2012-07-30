# -*- encoding: UTF-8 -*-

class PostsController < ApplicationController
  helper :all

  def create
    a = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a
    id = (
          Array.new(16) do
            a[rand(a.size)]
          end
          ).join
    view = case params[:view]
    when 'css_touch'
      'css_touch'
    when 'css'
      'css'
    else
      'flash'
    end
    TwitterLogic.tweet '3D view(' + view + '): ' + url_for(controller: 'posts', action: 'show', id: id, only_path: false, view: view), session['access_token'], session['access_token_secret'] if params[:tweet]
    redirect_to action: 'show', id: id, view: view
  end

  def show
    @view = case params[:view]
    when 'css_touch'
      'css_touch'
    when 'css'
      'css'
    else
      'flash'
    end
  end
end
