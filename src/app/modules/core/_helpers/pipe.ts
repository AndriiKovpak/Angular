import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
@Pipe({ name: 'SafeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(html: string) {
        return this.sanitizer.bypassSecurityTrustHtml(html || "");
    }
}