export class Post {
  postid: number;
  created: any;
  modified: any;
  title: string;
  body: string;

  constructor(postid: number,
        created: any,
        modified: any,
        title: string,
        body: string) {
            this.postid = postid;
            this.created = created;
            this.modified = modified;
            this.title = title;
            this.body = body;
    }
}