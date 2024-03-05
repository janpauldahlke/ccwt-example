import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Pokemon, PokemonService} from "./services/pokemon.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{

  disableSaving= false;
  indeterminate = false;
  form$ = this.formBuilder.nonNullable.group({
    allSelected: new FormControl(false),
    pokemons: this.formBuilder.nonNullable.group({}),
  })

  pokemons$ : Observable<Pokemon[]> = this.pokemonService.getPokemons().pipe(
    map((pokemons: Pokemon[]) => {
      const pokemonsControls = pokemons.reduce((acc: {[key: string]: FormControl}, pokemon: Pokemon) => {
        acc[pokemon.id.toString()] = new FormControl(false);
        return acc;
      }, {});
      const pokemonsFormGroup = this.formBuilder.group(pokemonsControls);
      this.form$.setControl('pokemons', pokemonsFormGroup);
      return pokemons;
    }),
    startWith([])
  );

  constructor(
    readonly formBuilder: FormBuilder,
    readonly pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    this.listenToPokemonSelections();

    this.form$.valueChanges.subscribe((changes) => {
      console.log('any CHanges', changes)
    })

    this.form$.controls.pokemons.valueChanges.subscribe((pokemonControls) => {
      console.log('pokemonControls chanes', pokemonControls)
    })

    this.form$.controls.allSelected.valueChanges.subscribe(value => {
      console.log('formallSelectedChanges', value)

      //this.toggleAll(!!value);
    });
  }

  listenToPokemonSelections() {
    const pokemonsGroup = this.form$.controls.pokemons as FormGroup;
    Object.values(pokemonsGroup.controls).forEach((control) => {
      const formControl = control as FormControl;

      formControl.valueChanges.subscribe((poke) => {
        console.log('pokeMonSelectionChanges', poke)
        const allSelected = Object.values(pokemonsGroup.controls).every(c => c.value);
        const someSelected = Object.values(pokemonsGroup.controls).some(c => c.value);


        this.form$.controls.allSelected.setValue(allSelected, { emitEvent: false });
        this.indeterminate = someSelected && !allSelected;
      });
    });
  }

  toggleAll(isSelected: boolean) {
    const pokemonsFormGroup = this.form$.get('pokemons') as FormGroup;
    Object.keys(pokemonsFormGroup.controls).forEach(key => {
      pokemonsFormGroup.controls[key].setValue(isSelected);
    });

    this.indeterminate = !isSelected;
  }


  savePokemon() {}

}
