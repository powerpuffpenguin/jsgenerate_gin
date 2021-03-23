import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { ServerAPI } from 'src/app/core/core/api';
import { Listener } from './listener';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Subject } from 'rxjs';
import { Closed } from 'src/app/core/utils/closed';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'logger-attach',
  templateUrl: './attach.component.html',
  styleUrls: ['./attach.component.scss']
})
export class AttachComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
  ) { }
  private closed_ = new Closed()
  listener: Listener | undefined
  get isAttach(): boolean {
    return this.listener ? true : false
  }
  get isNotAttach(): boolean {
    return this.listener ? false : true
  }
  checked = true
  ngOnInit(): void {
  }
  private subject_ = new Subject()
  @ViewChild("xterm")
  xterm: ElementRef | undefined
  private xterm_: Terminal | undefined
  private fitAddon_: FitAddon | undefined
  ngAfterViewInit() {
    // new xterm
    const xterm = new Terminal({
      cursorBlink: true,
      screenReaderMode: true,
      rendererType: 'canvas',
    })
    this.xterm_ = xterm
    // addon
    const fitAddon = new FitAddon()
    this.fitAddon_ = fitAddon
    xterm.loadAddon(fitAddon)
    xterm.loadAddon(new WebLinksAddon())

    xterm.open(this.xterm?.nativeElement)
    fitAddon.fit()
    this.xterm_ = xterm

    // window size change
    this.subject_.pipe(
      debounceTime(100),
      takeUntil(this.closed_.observable),
    ).subscribe((_) => {
      fitAddon.fit()
    })
  }
  onResize() {
    this.subject_.next()
  }
  ngOnDestroy() {
    this.closed_.close()
    this.onClickDetach()
  }
  onClickAttach() {
    if (this.listener) {
      return
    }
    this.listener = new Listener(
      ServerAPI.v1.loggers.websocketURL('attach', 'websocket'),
      this,
    )
  }
  onClickDetach() {
    if (!this.listener) {
      return
    }
    this.listener.close()
    this.listener = undefined
    this.xterm_?.writeln(`detach logger console`)
  }
  onClickClear() {
    this.xterm_?.clear()
  }
  writeln(text: string) {
    if (this.checked) {
      this.xterm_?.writeln(text)
    }
  }
  write(text: string) {
    if (this.checked) {
      this.xterm_?.write(text)
    }
  }
}
