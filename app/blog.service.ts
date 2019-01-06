
import { Injectable } from '@angular/core';
import { Post } from './post';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { post } from 'selenium-webdriver/http';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  posts: Post[];
  private getPostsUrl = 'http://localhost:3000/api/';
  private loginUrl = 'http://localhost:3000/login';
  private router: Router;
  private headers;
  username: string;

  constructor(private http: HttpClient) { }

  getCookie(name: String) : any {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return null;
}

  parseJWT() : Promise<String>
{

  return new Promise((resolve, reject) => {
    let jwt = this.getCookie('jwt');
    if(jwt){
      let jwtData = jwt.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);
      this.username = decodedJwtData.usr;
      if(this.username)
      resolve(this.username);
    }
  reject(null);
    });
}

  fetchPosts(username: string) : Observable<Post[]> {
    console.log("in fetchPosts");
    const url = `${this.getPostsUrl}${username}`;
    return this.http.get<Post[]>(url).pipe(
        tap(posts => {this.posts = posts;  console.log(this.posts);
        },
        error => {console.log("FETCHPOSTS ERROR:"+error.code+" "+error.redirect)} ),
        catchError(this.handleError('fetchPosts', []))
    );
  }

   getPost(username: string, id: number): Observable<Post[]> {
    return this.http.get<Post[]>
    (`${this.getPostsUrl}${username}/${id}`, { withCredentials: true}).pipe(catchError(this.handleError('getPost', [])));
  }

  getPosts(username: string): Post[] {
    return this.posts;
  }



  getSelectedPostIndex(selectedPostId: number) : Promise<number>{
    return new Promise((resolve, reject) => {
      let i;
      console.log("---------------------"+this.posts);
      for(i=0;i<this.posts.length;i++){
        if(this.posts[i].postid == selectedPostId){
          resolve(i);
        }
      }
      reject(-1);
      });
   
  }


  newPost(username: string): Observable<Post> {
    	let newId = 1;
    	if(this.posts.length > 0) {
      		newId = this.posts[this.posts.length - 1].postid + 1;
    	}
    	let newPost = new Post(newId, new Date(), new Date(), "", "");
    	const url = `${this.getPostsUrl}${username}/${newId}`;
    	return this.http.post<Post>(url, newPost).pipe(
        map(post => {return newPost}),
        tap(post => {this.posts.push(newPost)},
        error => {console.log("New Post Creation Error")}),
        catchError(this.handleError<Post>('New Post Creation Error'))
      );
  	}


private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    if(error.status && error.status === 401)
    {
      window.location.href = this.loginUrl + "?redirect=/editor/";

    }
    return of(result as T);
  };
}


  savePost(post: Post):Observable<Post> {
  return this.http.put<Post>(`${this.getPostsUrl}${this.username}/${post.postid}`, {title:post.title, body: post.body},{withCredentials: true})
  .pipe(
    tap(post => {console.log("Saved succesfully")},
    error => {console.log(" Error while saving post")}),
    catchError(this.handleError<Post>('Error while saving post')));
  }
  

  
  deletePost(post: Post, selectedPostIndex : number) {
    return this.http.delete<Post>(`${this.getPostsUrl}${this.username}/${post.postid}`, {withCredentials: true})
    .pipe(
      tap(res => {this.posts.splice(selectedPostIndex, 1); console.log("Post deleted successfully")}),
      catchError(this.handleError<Post>('Error while deleting post'))
    );
    }
  }
