# City Object Structure

## Top Level
- tiles | **'list'**
- cityName | 'str'
- first | 'int'
- founded | 'int'
- daysElapsed | 'int'
- money | 'int'
- population | 'int'
- labels | **'list'**


## Tiles
- alt            'int'
- water          'bool'
- terrain        **'dict'**
- building       'int'
- zone           **'dict'**
- underground    **'dict'**
- saltwater      'bool'
- watercover     'bool'
- watersupplied  'bool'
- piped          'bool'
- powersupplied  'bool'
- conductive     'bool'

### Terrain
- slope       **'list'**
- waterlevel  'str'

#### Slope
- 4x 'int'

### Underground
- slope   **'list'**
- subway  'bool'

#### Slope
- 4x 'int'

### Zone
- topLeft     'bool'
- topRight    'bool'
- bottomLeft  'bool'
- bottomRight 'bool'
- type        'int'

## Labels