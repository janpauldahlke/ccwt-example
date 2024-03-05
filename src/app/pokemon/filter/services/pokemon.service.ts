import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, map, Observable, of} from 'rxjs';

export type PokemonFilter = {
  allSelected : boolean,
  pokemon : FlatPokemon[],
}



export type FlatPokemon =  Pick<Pokemon, 'name' | 'id'>;

export type Pokemon = {
  name: string;
  id: number;
  species: string;
  img: string; // maybe URL?
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  randomPokemonNumbers = [240, 146, 401, 870, 67]
  constructor(readonly http: HttpClient) {}

  getPokemonFilterSettings() : Observable<PokemonFilter> {
  // in the original example the names come from here
    const couldBeHttpFilter: PokemonFilter = {
      allSelected: false,
      pokemon: [
        {
          name: 'foo',
          id: 240
        },
        {
          name: 'fara',
          id: 146
        }
      ]
    }
    return of(couldBeHttpFilter)
  }

  getPokemons(): Observable<Pokemon[]> {
    const ids = this.randomPokemonNumbers
    return forkJoin(ids.map(id => this.http.get(`${this.baseUrl}/${id}`))).pipe(
      map((pokemons: any) => {
        return pokemons.map((pokemon: any) => ({
          id: pokemon.id,
          name: pokemon.name,
          species: pokemon.species.name,
          img: pokemon.sprites.front_default,

        } as Pokemon))
      })
    );
  }

}
