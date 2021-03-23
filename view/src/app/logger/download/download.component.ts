import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { ServerAPI } from 'src/app/core/core/api';
import { Closed } from 'src/app/core/utils/closed';
interface Response {
  names?: Array<string>
}
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {
  private closed_ = new Closed()
  constructor(private readonly httpClient: HttpClient,
  ) { }
  err: any
  ready = false
  source = new Array<string>()
  private set_ = new Set<string>()
  ngOnInit(): void {
    this.load()
  }
  ngOnDestroy() {
    this.closed_.close()
  }
  load() {
    this.err = null
    this.ready = false
    ServerAPI.v1.loggers.get<Response>(this.httpClient).pipe(
      takeUntil(this.closed_.observable),
      finalize(() => {
        this.ready = true
      })
    ).subscribe((response) => {
      if (response && response.names && response.names.length > 0) {
        for (let i = 0; i < response.names.length; i++) {
          const element = response.names[i]
          if (typeof element === "string" && element.length > 0) {
            if (this.set_.has(element)) {
              continue
            }
            this.source.push(element)
            this.set_.add(element)
          }
        }
        this.source.sort()
      }
    }, (e) => {
      this.err = e
    })
  }
  getURL(name: string): string {
    return ServerAPI.v1.loggers.httpURL('download', name)
  }
}
