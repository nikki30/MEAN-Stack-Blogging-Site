import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlogService} from '../blog.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationStart } from '@angular/router';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  selectedPostIndex: number;
  selectedPost: Post;
  private errorMessage: String;
  
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) { 

    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        this.saveButtonPost();
      }
    });
  }


  
  ngOnInit() {
      this.route.params.subscribe((params: Params) => {
        this.blogService.getSelectedPostIndex(params['id']).then((data) => { this.selectedPostIndex = data; this.selectedPost = this.blogService.posts[this.selectedPostIndex]},
        (err) => { console.log(err); } );
        
  });
}

  savePost() {
    let post = this.blogService.posts[this.selectedPostIndex];
    this.blogService.savePost(post).subscribe(post => {}, error => {this.errorMessage = <any>error;});
  }

  saveButtonPost() {
    let post = this.blogService.posts[this.selectedPostIndex];
    post.modified = Date.now();
    this.blogService.savePost(post).subscribe(post => {}, error => {this.errorMessage = <any>error;});
  }

  deletePost() {
    this.blogService.deletePost(this.blogService.posts[this.selectedPostIndex], this.selectedPostIndex).subscribe(post => {this.router.navigateByUrl('/');}, error => {this.errorMessage = <any>error; this.router.navigateByUrl('/')});
    }
}
