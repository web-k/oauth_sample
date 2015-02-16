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
    when 'flash'
      'flash'
    when 'webgl'
      'webgl'
    else
      nil
    end
    TwitterLogic.tweet '3D view(' + view + '): ' + url_for(controller: 'posts', action: 'show', id: id, only_path: false, view: view), session['access_token'], session['access_token_secret'] if params[:tweet]
    redirect_to action: 'show', id: id, view: view
  end

  def show
    @id = params[:id].to_i
    @view = case params[:view]
    when 'css_touch'
      'css_touch'
    when 'css'
      'css'
    when 'flash'
      'flash'
    when 'webgl'
      'webgl'
    when 'webgl_video'
      'webgl_video'
    else
      ios? ? 'css_touch' : 'flash'
    end
  end
  
end
