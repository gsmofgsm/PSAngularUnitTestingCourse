
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroesComponent} from './heroes.component';
import {HeroComponent} from '../hero/hero.component';
import { HeroService } from '../hero.service';
import { NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { of } from 'rxjs';
import {By} from '@angular/platform-browser';

@Directive({
    'selector': '[routerLink]',
    'host': {'(click)': 'onClick()'}
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigateTo: any = null;
    
    onClick() {
        this.navigateTo = this.linkParams;
    }
}

describe('HeroesComponent (deep)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero'])
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent, 
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        // run ngOnInit()
        fixture.detectChanges();
    })

    it('should render each hero as a HeroComponent', () => {
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);

        for(let i=0; i<heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i])
        }
    })

    it(`should call heroService.deleteHero when the HeroComponent's
        delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // heroComponentDEs[0].query(By.css('button'))
        //     .triggerEventHandler('click', {stopPropagation: ()=>{}})
        // (<HeroComponent>heroComponentDEs[0].componentInstance).delete.emit()
        heroComponentDEs[0].triggerEventHandler('delete', null)

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    })

    it('should add a new hero to the hero list when the add button is clicked', () => {
        const name = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}))
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    })

    it('should have the correct route for the first hero', () => {
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        let routerLink = heroComponentDEs[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        heroComponentDEs[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigateTo).toBe('/detail/1')
    })
})