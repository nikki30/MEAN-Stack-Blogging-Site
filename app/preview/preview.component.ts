import { Component, OnInit, Input } from '@angular/core';
import { BlogService} from '../blog.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  	selectedPostIndex: number;
	selectedPost: Post;
	previewPost: Post;
	htmlBody: any;
	htmlTitle: any;
	  
  	constructor(private blogService: BlogService, private route: ActivatedRoute, private router: Router, private _dom: DomSanitizer) { }

  	ngOnInit() {
  		this.route.params.subscribe((params: Params) => {
        	this.blogService.getSelectedPostIndex(params['id']).then((data) => { 
				this.selectedPostIndex = data; 
				this.selectedPost = this.blogService.posts[this.selectedPostIndex];

				const reader = new Parser();
     		    const writer = new HtmlRenderer();
      			this.htmlBody = this._dom.bypassSecurityTrustHtml(writer.render(reader.parse(this.selectedPost.body)));
      			this.htmlTitle = this._dom.bypassSecurityTrustHtml(writer.render(reader.parse(this.selectedPost.title)));
			},
        	err => { console.log(err); } );   
  		});
  	}

  	editButton() {
  		this.router.navigate(['edit', this.selectedPost.postid]);
  	}

}
