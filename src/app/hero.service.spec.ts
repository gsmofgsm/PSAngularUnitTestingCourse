import { TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestController: HttpTestingController;
    let heroService: HeroService

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        });

        httpTestController = TestBed.get(HttpTestingController);
        heroService = TestBed.get(HeroService);
    });

    describe('getHero', () => {
        it('should call get with the correct url', () => {
            heroService.getHero(4).subscribe(() => {
                console.log('retrieved');
            });
            // heroService.getHero(3).subscribe();
            const req = httpTestController.expectOne('api/heroes/4');
            // req.flush({id: 4, name: 'gsm', strength: 1000});
            httpTestController.verify();
        })
    })
})