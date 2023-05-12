import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { LoggerService } from './logger.service';
import { localStorageToken } from './localstorage.token';
import { InitService } from './init.service';
import { ConfigService } from './services/config.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'hinv-root',
  templateUrl: './app.component.html',
  //template: `<h1>Hello world from inline template</h1>`,
  styleUrls: ['./app.component.scss'],
  //styles: [`h1 {color: red}`]
})
export class AppComponent implements OnInit {
  title = 'hotelinventoryapp';

  @ViewChild('name', { static: true }) name!: ElementRef;

  constructor(
    @Optional() private loggerServices: LoggerService,
    @Inject(localStorageToken) private localStorage: any,
    private configService: ConfigService,
    private initService: InitService,
    private router: Router
  ) {
    console.log(initService.config);
  }

  //@ViewChild('user', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.loggerServices?.log('AppComponent.ngOnInit()');
    //const componentRef = this.vcr.createComponent(RoomsComponent);
    //componentRef.instance.numberOfRooms = 30;
  }
  ngOnInit(): void {
    //this.router.events.subscribe((event) => {
    //  console.log(event);
    //});

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        console.log('Navigation Started!');
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.log('Navigation Completed!');
      });

    //this.name.nativeElement.innerText = 'Hilton Hotels';
    this.localStorage.setItem('name', 'Hilton Hotel');
  }
}
