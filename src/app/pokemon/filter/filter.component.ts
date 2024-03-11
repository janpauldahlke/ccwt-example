import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, Subscription, tap} from "rxjs";
import {FlatPokemon, Pokemon, PokemonFilter, PokemonService} from "./services/pokemon.service";


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {

  disableSaving = false;
  indeterminate = false;
  savedAllSelected = false;
  savedPokemon: any;
  formSubscription = new Subscription();
  private nestedFormSubscriptions = new Subscription();

  form$ = this.formBuilder.nonNullable.group({
    allSelected: this.formBuilder.nonNullable.control(false),
    pokemons: this.formBuilder.nonNullable.group({}),
  })
  pokemonInfo : Pokemon[] = [];

  filterSettings$ = this.pokemonService.getPokemonFilterSettings();
  pokemonsHttp$: Observable<Pokemon[]> = this.pokemonService.getPokemons();

  pokemons$: Observable<Pokemon[]> = combineLatest({
    pokemonInfo: this.pokemonsHttp$,
    filters: this.filterSettings$
  }).pipe(
    distinctUntilChanged(),
    tap(({pokemonInfo, filters}) => {
      this.pokemonInfo = pokemonInfo;
      const pokemonsControls = pokemonInfo.reduce((acc: { [key: string]: FormControl }, pokemon: Pokemon) => {
        const isSelected = filters.pokemon.some(filterPokemon => filterPokemon.id === pokemon.id);
        acc[pokemon.id.toString()] = this.formBuilder.control(isSelected);
        return acc;
      }, {});
      this.form$.setControl('pokemons', this.formBuilder.group(pokemonsControls));
      this.form$.get('allSelected')?.setValue(filters.allSelected, {emitEvent: false});
      this.indeterminate = !filters.allSelected && filters.pokemon.length > 0;
    }),
    map(({pokemonInfo}) => pokemonInfo)
  )

  constructor(
    readonly formBuilder: FormBuilder,
    readonly pokemonService: PokemonService,
  ) {
  }

  ngOnInit() {
    this.listenToPokemonSelections();

    this.form$.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        debounceTime(15),
        tap((changes) => {
          if (JSON.stringify(changes.pokemons) !== JSON.stringify(this.savedPokemon)) {
            if (!changes.pokemons) return
            const isEveryPokemonSelected = Object.values(changes.pokemons).every(val => val === true)
            const isSomePokemonSelected = Object.values(changes.pokemons).some(val => val === true)
            if (isEveryPokemonSelected) {
              this.form$.controls.allSelected.patchValue(isEveryPokemonSelected);
            } else {
              if (!isSomePokemonSelected) {
                this.form$.controls.allSelected.patchValue(isSomePokemonSelected);
              }
            }

            this.indeterminate = isSomePokemonSelected && !isEveryPokemonSelected
            this.disableSaving = !isSomePokemonSelected
            this.savedPokemon = changes.pokemons // cheap memoize with an any classMember!!

          }

          if (changes.allSelected !== this.savedAllSelected) {
            this.toggleAll();
            this.savedAllSelected = changes.allSelected ? changes.allSelected : false

          }
        })
      )
      .subscribe()

  }

  ngOnDestroy() {
    if(this.formSubscription) this.formSubscription.unsubscribe()
    if(this.nestedFormSubscriptions) this.nestedFormSubscriptions.unsubscribe()
  }

  listenToPokemonSelections() {
    const pokemonsGroup = this.form$.controls.pokemons as FormGroup;
    Object.values(pokemonsGroup.controls).forEach((control) => {
      const formControl = control as FormControl;

     const subscription= formControl.valueChanges.subscribe((poke) => {
        const allSelected = Object.values(pokemonsGroup.controls).every(c => c.value);
        const someSelected = Object.values(pokemonsGroup.controls).some(c => c.value);
        this.form$.controls.allSelected.setValue(allSelected, {emitEvent: false});
        this.indeterminate = someSelected && !allSelected;
      });
      this.nestedFormSubscriptions.add(subscription);
    });
  }

  toggleAll() {
    const pokemonsControls = this.form$.controls.pokemons;
    const toggle = this.form$.controls.allSelected.value!;
    const pokemonUpdates =  Object.keys(pokemonsControls.controls).reduce((acc, key) => ({
      ...acc,
      [key]: toggle
    }), {});

    this.form$.controls.pokemons.patchValue(pokemonUpdates);
  }

    savePokemon() {

      const formValues = this.form$.getRawValue()
      const {allSelected, pokemons}: {allSelected: boolean, pokemons: {[key: string]: boolean}} = formValues;
      if(Object.keys(pokemons).length < 1 || allSelected === null) return
      const lookUpPokemonName = (id: string) => this.pokemonInfo.find(pokemon => pokemon.id.toString() === id)?.name
      const pokemon= Object.keys(pokemons)
        .filter((key) => pokemons[key!])
        .map(id => {
          return {id: parseInt(id), name: lookUpPokemonName(id)} as FlatPokemon;
        });

      const updatedFilter : PokemonFilter = {
        allSelected,
        pokemon,
      }
      this.pokemonService.savePokemonFilter(updatedFilter)
  }
}
