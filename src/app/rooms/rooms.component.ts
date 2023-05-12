import {
  Component,
  DoCheck,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ViewChildren,
  QueryList,
  OnDestroy,
  SkipSelf,
} from '@angular/core';
import { Room, RoomList } from './rooms';
import { HeaderComponent } from '../header/header.component';
import { RoomsService } from './services/rooms.service';
import { Observable, Subject, Subscription, catchError, map, of } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'hinv-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent
  implements OnInit, DoCheck, AfterViewInit, AfterViewChecked, OnDestroy
{
  hotelName = 'Hilton Hotel';

  numberOfRooms = 10;
  hideRooms = true;

  selectedRoom!: RoomList;

  rooms: Room = {
    totalRooms: 20,
    availableRooms: 10,
    bookedRooms: 5,
  };

  title = 'Room List';

  roomList: RoomList[] = [];

  stream = new Observable((observer) => {
    observer.next('user1');
    observer.next('user2');
    observer.next('user3');
    observer.complete();
    //observer.error('error');
  });

  @ViewChild(HeaderComponent)
  headerComponent!: HeaderComponent;

  @ViewChildren(HeaderComponent)
  headerChildrenComponent!: QueryList<HeaderComponent>;

  //roomService = new RoomsService();

  constructor(
    @SkipSelf() private roomsService: RoomsService,
    private configService: ConfigService
  ) {}
  ngAfterViewChecked(): void {}

  ngAfterViewInit(): void {
    //this.headerComponent.title = 'Rooms View';
    //console.log((this.headerChildrenComponent.last.title = 'Last title'));
  }

  ngDoCheck(): void {
    console.log('on changes is called');
  }

  totalBytes = 0;

  subscription!: Subscription;

  error$ = new Subject<string>();

  getError$ = this.error$.asObservable();

  rooms$ = this.roomsService.getRooms$.pipe(
    catchError((err) => {
      //console.log(err);
      this.error$.next(err.message);
      return of([]);
    })
  );

  priceFilter = new FormControl(0);

  roomsCount$ = this.roomsService.getRooms$.pipe(map((rooms) => rooms.length));

  ngOnInit(): void {
    this.roomsService.getPhotos().subscribe((event) => {
      switch (event.type) {
        case HttpEventType.Sent: {
          console.log('Request has been made!');
          break;
        }
        case HttpEventType.ResponseHeader: {
          console.log('Request success!');
          break;
        }
        case HttpEventType.DownloadProgress: {
          this.totalBytes = event.loaded;
          console.log(this.totalBytes);

          break;
        }
        case HttpEventType.Response: {
          console.log(event.body);
        }
      }
    });

    this.stream.subscribe({
      next: (next) => console.log(next),
      complete: () => console.log('Complited!'),
      error: (err) => console.log(err),
    });
    this.stream.subscribe((data) => console.log(data));
    //this.subscription = this.roomsService.getRooms$.subscribe((rooms) => {
    //  this.roomList = rooms;
    //});
  }

  toggle() {
    this.hideRooms = !this.hideRooms;
    this.title = 'Rooms List';
    //this.title.toLowerCase;
  }

  selectRoom(room: RoomList) {
    console.log(room);

    this.selectedRoom = room;
  }

  addRoom() {
    const room: RoomList = {
      roomNumber: '4',
      roomType: 'Deluxe Room',
      amenities: 'Air Conditioner, Free Wi-Fi, TV, Bathroom, Kitchen',
      price: 500,
      photos:
        'https://kulttura.ru/upload/iblock/78e/78e11d6531b6a828bf5b2057fb11b5a8.jpg',
      checkinTime: new Date('11-Nov-2023'),
      checkoutTime: new Date('12-Nov-2023'),
      rating: 4.5,
    };

    //this.roomList.push(room);
    //this.roomList = [...this.roomList, room];
    this.roomsService.addRoom(room).subscribe((data) => {
      this.roomList = data;
    });
  }

  editRoom() {
    const room: RoomList = {
      roomNumber: '3',
      roomType: 'Deluxe Room',
      amenities: 'Air Conditioner, Free Wi-Fi, TV, Bathroom, Kitchen',
      price: 500,
      photos:
        'https://kulttura.ru/upload/iblock/78e/78e11d6531b6a828bf5b2057fb11b5a8.jpg',
      checkinTime: new Date('11-Nov-2023'),
      checkoutTime: new Date('12-Nov-2023'),
      rating: 4.5,
    };

    this.roomsService.editRoom(room).subscribe((data) => {
      this.roomList = data;
    });
  }

  deleteRoom() {
    this.roomsService
      .delete('07de500c-ecbb-4e8b-845b-0b5913746c97')
      .subscribe((data) => {
        this.roomList = data;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
