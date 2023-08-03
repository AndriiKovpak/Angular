import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-static-footer',
  templateUrl: './static-footer.component.html',
  styleUrls: ['./static-footer.component.scss']
})
export class StaticFooterComponent implements OnInit {

  constructor( private scroll: ViewportScroller) { }

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event:any){
    this.pageYoffset = window.pageYOffset;
 }
  ngOnInit(): void {
  }
  scrollToTop(){
    this.scroll.scrollToPosition([1,1]);
}
}
