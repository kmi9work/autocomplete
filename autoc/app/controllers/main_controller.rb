class MainController < ApplicationController
  def cases
    @results = [{:id => 1, :name => "ololo"}, {:id => 2, :name => "second"}] 
    #@results = Cases.find(:all)
    respond_to do |format| 
      format.js
    end
  end
  
  def show_man
    sleep(1) #Убрать!!!
    @case = {:id => 1, :name => "ololo"}
    #@case = Cases.find(params[:id])
    
  end
  
  def classifier
    @groups = [{:id => 1, :name => "ololo"}, {:id => 2, :name => "second"}] 
    #@groups = Groups.find(:all)
    respond_to do |format| 
      format.js
    end
  end
  
  def subgroups
    @subgroups = [{:id => 1, :name => "Lorem Ipsum"}, {:id => 2, :name => "Sit Dolor Amet"}] 
    #@subgroups = SubGroups.find_by_group_id(params[:id])
    
  end
  
  def categories
    @categories = [{:id => 1, :name => "Consectetur adipisicing"}, {:id => 2, :name => "elit"}] 
    #@categories = Categories.find_by_subgroup_id(params[:id])
    
  end
  
  def index
  end
  
  
end
