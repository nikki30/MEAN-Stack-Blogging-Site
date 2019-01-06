import { BlogService } from '../blog.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../post'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];
  errorMsg: String;
    
  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit() {
    let jwt = this.blogService.getCookie('jwt');
    
    if(jwt){
      this.blogService.parseJWT().then((username) => 
      {
        this.blogService.fetchPosts(this.blogService.username).subscribe(posts => {this.blogService.posts = posts; });},
      (error) => {console.log("Not logged in")}
      );
    }
    else{
      this.blogService.fetchPosts(this.blogService.username).subscribe();
    }
    //this.blogService.fetchPosts('cs144').subscribe(posts => {this.posts = posts}, error => this.errorMessage = <any>error);

  }

    addPost(): void {
	    this.blogService.newPost(this.blogService.username)
      .subscribe(post => {this.router.navigate(['edit', post.postid])});
	  }
    

}
