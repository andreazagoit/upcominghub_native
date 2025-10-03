# ActionButton Component

Un bottone circolare con icona, ideale per azioni come favorite, like, bookmark, etc.

## Caratteristiche

- ✅ Bottone circolare con icona
- ✅ Supporto per testo opzionale
- ✅ Stati attivo/inattivo con colori personalizzati
- ✅ Loading state con spinner
- ✅ 3 dimensioni (sm, default, lg)
- ✅ 3 varianti base (default, outline, ghost)
- ✅ 5 colori attivi (red, blue, green, purple, orange)
- ✅ 3 stili attivi (filled, outlined, subtle)
- ✅ Animazioni smooth

## Utilizzo Base

```tsx
import {ActionButton} from "@/components/ui/action-button";

// Bottone favorito semplice
<ActionButton
  icon="heart"
  isActive={isFavorite}
  onPress={() => toggleFavorite()}
  activeColor="red"
/>

// Con testo
<ActionButton
  icon="heart"
  isActive={isFavorite}
  onPress={() => toggleFavorite()}
  activeColor="red"
>
  Aggiungi ai preferiti
</ActionButton>

// Loading state
<ActionButton
  icon="bookmark"
  isLoading={true}
  activeColor="blue"
/>
```

## Props

| Prop            | Tipo                                                 | Default      | Descrizione            |
| --------------- | ---------------------------------------------------- | ------------ | ---------------------- |
| `icon`          | `IconName`                                           | **required** | Nome icona di Ionicons |
| `isActive`      | `boolean`                                            | `false`      | Stato attivo           |
| `isLoading`     | `boolean`                                            | `false`      | Mostra spinner         |
| `onPress`       | `() => void`                                         | -            | Callback al click      |
| `disabled`      | `boolean`                                            | `false`      | Disabilita il bottone  |
| `size`          | `"sm" \| "default" \| "lg"`                          | `"default"`  | Dimensione             |
| `variant`       | `"default" \| "outline" \| "ghost"`                  | `"outline"`  | Variante base          |
| `activeColor`   | `"red" \| "blue" \| "green" \| "purple" \| "orange"` | `"red"`      | Colore attivo          |
| `activeVariant` | `"filled" \| "outlined" \| "subtle"`                 | `"filled"`   | Stile attivo           |
| `children`      | `string`                                             | -            | Testo opzionale        |
| `style`         | `ViewStyle`                                          | -            | Stile custom           |

## Esempi

### Bottone Favorito (Heart)

```tsx
<ActionButton
  icon="heart"
  isActive={isFavorite}
  onPress={toggleFavorite}
  activeColor="red"
  activeVariant="filled"
/>
```

### Bottone Bookmark

```tsx
<ActionButton
  icon="bookmark"
  isActive={isBookmarked}
  onPress={toggleBookmark}
  activeColor="blue"
  activeVariant="filled"
/>
```

### Bottone Like con testo

```tsx
<ActionButton
  icon="thumbs-up"
  isActive={isLiked}
  onPress={toggleLike}
  activeColor="green"
>
  {isLiked ? "Ti piace" : "Mi piace"}
</ActionButton>
```

### Bottone Notifiche

```tsx
<ActionButton
  icon="notifications"
  isActive={notificationsEnabled}
  onPress={toggleNotifications}
  activeColor="orange"
  activeVariant="outlined"
/>
```

### Loading State

```tsx
<ActionButton icon="heart" isLoading={true} activeColor="red" />
```

### Dimensioni

```tsx
{
  /* Piccolo */
}
<ActionButton icon="heart" size="sm" />;

{
  /* Default */
}
<ActionButton icon="heart" size="default" />;

{
  /* Grande */
}
<ActionButton icon="heart" size="lg" />;
```

### Varianti Attive

```tsx
{
  /* Filled - sfondo colorato */
}
<ActionButton
  icon="heart"
  isActive={true}
  activeColor="red"
  activeVariant="filled"
/>;

{
  /* Outlined - solo bordo colorato */
}
<ActionButton
  icon="heart"
  isActive={true}
  activeColor="red"
  activeVariant="outlined"
/>;

{
  /* Subtle - sfondo leggero */
}
<ActionButton
  icon="heart"
  isActive={true}
  activeColor="red"
  activeVariant="subtle"
/>;
```

## Icone Disponibili

Puoi usare qualsiasi icona di [Ionicons](https://ionic.io/ionicons):

- `heart`, `heart-outline`
- `bookmark`, `bookmark-outline`
- `star`, `star-outline`
- `thumbs-up`, `thumbs-up-outline`
- `notifications`, `notifications-outline`
- `eye`, `eye-outline`
- `lock-closed`, `lock-open`
- etc.

## Colori

5 colori disponibili per lo stato attivo:

- **red**: Perfetto per favoriti/heart
- **blue**: Ideale per bookmark/info
- **green**: Ottimo per like/success
- **purple**: Adatto per premium/special
- **orange**: Buono per notifiche/warning

## Note

- Il bottone è sempre circolare quando non ha testo
- Con testo, diventa un pill (bordi arrotondati)
- Lo spinner sostituisce l'icona durante il loading
- Gli stati pressed hanno animazioni smooth
