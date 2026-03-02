table for later:

should i even be creating specific drawable object types? it seems to add more complexity. for every type, i have to create a specific component.

shouldn't i just declare shapes, and the renderer renders them

e.g. 
select tool line with markers
create all objects during onclick, onmove, etc.


<Render model={object}>

then inside Render:

model.map(obj => {
    switch(obj.type) {
        case 'line':
            return <Line ... />
        case 'twoLinePoint':
            return <><Line ... /><Circle .../> ... </>
        ...
        default:
            return ...
    }
})


is this a good design at all? if not, why is it bad?