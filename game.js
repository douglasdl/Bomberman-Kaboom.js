kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    canvas: document.querySelector("#mycanvas"),
    background: [ 0, 0, 0, 1],
})

// Load assets
loadRoot('assets/')
loadSprite('wall', 'wall.png')
loadSprite('brick', 'brick.png')
loadSprite('floor', 'floor.png')
loadSprite('player', 'Bomberman.png', {
    sliceX: 7,
    sliceY: 4,
    anims: {
        idleUp: {
            from: 0,
            to: 0,
        },
        idleDown: {
            from: 14,
            to: 14,
        },
        idleLeft: {
            from: 21,
            to: 21,
        },
        idleRight: {
            from: 7,
            to: 7,
        },
        up: {
            from: 0,
            to: 6,
        },
        down: {
            from: 14,
            to: 20,
        },
        left: {
            from: 21,
            to: 27,
        },
        right: {
            from: 7,
            to: 13,
        },
    },
})


const maps = [
    [
        'aaaaaaaaaaaaaaa',
        'a   b         a',
        'a             a',
        'a             a',
        'a   b         a',
        'a   b         a',
        'a             a',
        'aaaaa         a',
        'a             a',
        'a             a',
        'a        b    a',
        'a             a',
        'a b        b  a',
        'a             a',
        'aaaaaaaaaaaaaaa'
    ],
    [
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
        '               ',
    ]
]

const levelCfg = {
    width: 52,
    height: 52,
    pos: vec2(10, 50),
    'a': () => [sprite('wall'), "wall", area(), solid()],
    'b': () => [sprite('brick'), "brick", area(), solid()],
    ' ': () => [sprite('floor'), "floor", layer('bg')],
}

scene("startMenu", ({ score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')


    add([text('BOMBERMAN'), pos(200, 150), layer('ui'), scale(1)])
    //add([text('Score: ' + score), pos(200, 200), layer('ui'), scale(0.5)])
    add([text('Press Enter to start'), pos(200, 250), layer('ui'), scale(0.5)])

    keyDown('enter', () => {
        go('game', {
            level: 0,
            score: 0
        })
    })
})

scene("game", ({ score }) => {

    layers(['bg', 'obj', 'ui'], 'obj')

    const gameLevel = addLevel(maps[0], levelCfg)

    const scoreLabel = add([
        text(`Score: ${score}`), 
        pos(10, 10), 
        layer('ui'),
        {
            value: score,
        },
        scale(0.5)
    ])


    // Player
    const MOVE_SPEED = 120
    const player = add([
        sprite('player', {
            animSpeed:0.5,
            frame: 14,
        }),  
        area(), 
        pos(60, 100), 
        layer('obj'),
        {
            //Right by default
            dir: vec2(1, 0),
        },
        'player'
    ])

    player.action(() => {
        player.pushOutAll()
    })

    // const directions = {
    //     'left': vec2(-1, 0),
    //     'right': vec2(1, 0),
    //     'up': vec2(0, -1),
    //     'down': vec2(0, 1),
    // }

    // // Move player
    // for(const direction in directions) {
    //    keyDown(direction, () => {
    //         //player.move(directions[direction] * MOVE_SPEED)
    //         player.dir = directions[direction]
    //    })
    // }
    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1, 0)
    })
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1, 0)
    })
    keyDown('up', () => {
        player.move(0, -MOVE_SPEED)
        player.dir = vec2(0, -1)
    })
    keyDown('down', () => {
        player.move(0, MOVE_SPEED)
        player.dir = vec2(0, 1)
    })

    // player.on('move', () => {
    //     if(player.dir === vec2(1, 0)) {
    //         player.anim('right')
    //     } else if(player.dir === vec2(-1, 0)) {
    //         player.anim('left')
    //     } else if(player.dir === vec2(0, 1)) {
    //         player.anim('down')
    //     } else if(player.dir === vec2(0, -1)) {
    //         player.anim('up')
    //     } else {
    //         player.anim('idle')
    //     }
    // })

    

    // Animate the player while moving
    keyPress('left', () => {
        player.play('left')
    })
    keyPress('right', () => {
        player.play('right')
    })
    keyPress('up', () => {
        player.play('up')
    })
    keyPress('down', () => {
        player.play('down')
    })

    // Stop animation when not moving
    keyRelease('left', () => {
        player.play('idleLeft')
        // player.stop()
    })
    keyRelease('right', () => {
        // player.stop()
        player.play('idleRight')
    })
    keyRelease('up', () => {
        player.play('idleUp')
        // player.stop()
    })
    keyRelease('down', () => {
        player.play('idleDown')
        // player.stop()
    })



})




scene("lose", ({ score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    add([text('You lose'), pos(200, 150), layer('ui'), scale(0.5)])
    add([text('Score: ' + score), pos(200, 200), layer('ui'), scale(0.5)])
    add([text('Press Enter to restart'), pos(200, 250), layer('ui'), scale(0.5)])

    keyDown('enter', () => {
        go('game', {
            level: 0,
            score: 0
        })
    })
})


function start() {
	// Start with the "game" scene, with initial parameters
	go("startMenu", {
        level: 1,
        score: 0,
	})
}

start()