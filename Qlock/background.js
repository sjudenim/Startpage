function format_time(time) {
    return (time < 10) ? '0' + time : time;
}

function find_and_set_mode() {
    var width = document.getElementsByTagName('body')[0].clientWidth,
        previous_mode = qlock.mode;

    if (width <= 178) {
        qlock.mode = 'small';
    } else if (width <= 255) {
        qlock.mode = 'medium';
    } else {
        qlock.mode = 'large';
    }

    if (qlock.mode != previous_mode) {
        qlock.update();
    }
}

var qlock = {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVQXYZ',

    // 11x10
    original_text: [
        "ITLISBFAMPM", "ACQUARTERDC", "TWENTYFIVEX",
        "HALFBTENFTO", "PASTERUNINE", "ONESIXTHREE",
        "FOURFIVETWO", "EIGHTELEVEN", "SEVENTWELVE",
        "TENSEOCLOCK"
    ],

    // 11x6
    initial_rows: [
        'ITLISAQLOCK',
        'ACQUARTERDC', // Mutable
        'HALFBTENFTO',
        'PASTTENNINE',
        'ONESIXTHREE', // Mutable
        'OCLOCKEAMPM'
    ],

    // 9x5
    initial_medium_rows: [
        'ITLISAQLO',
        'TWNTYFIVE',
        'PASTRUNTO',
        'ONESIXTEN',
        'QLOCKAMPM'
    ],

    // 3x5
    initial_small_rows: [
        'ITLIS',
        '12:00',
        'AM|PM'
    ],

    word_map: { // Row String,    x, y, len
        it: {
            large: ['ITLISAQLOCK', [0, 0, 2]],
            medium: ['ITLISAQLO', [0, 0, 2]],
            small: ['ITLIS', [0, 0, 2]]
        },
        is: {
            large: ['ITLISAQLOCK', [3, 0, 2]],
            medium: ['ITLISAQLO', [3, 0, 2]],
            small: ['ITLIS', [3, 0, 2]]
        },
        five: {
            large: ['TWENTYXFIVE', [7, 1, 4]],
            medium: ['TWNTYFIVE', [5, 1, 4]]
        },
        ten: {
            large: ['HALFBTENFTO', [5, 2, 3]],
            medium: ['HALFULTEN', [6, 1, 3]]
        },
        a: {
            large: ['ACQUARTERDC', [0, 1, 1]],
            medium: ['ACQUARTER', [0, 1, 1]]
        },
        quarter: {
            large: ['ACQUARTERDC', [2, 1, 7]],
            medium: ['ACQUARTER', [2, 1, 7]]
        },
        twenty: {
            large: ['TWENTYXFIVE', [0, 1, 6]],
            medium: ['TWNTYFIVE', [0, 1, 5]]
        },
        half: {
            large: ['HALFBTENFTO', [0, 2, 4]],
            medium: ['HALFULTEN', [0, 1, 4]]
        },
        to: {
            large: ['HALFBTENFTO', [9, 2, 2]],
            medium: ['PASTRUNTO', [7, 2, 2]]
        },
        past: {
            large: ['PASTASKJDPE', [0, 3, 4]],
            medium: ['PASTKTOHY', [0, 2, 4]]
        },
        0: {
            large: ['SEVENTWELVE', [5, 4, 6]],
            medium: ['WYOTWELVE', [3, 3, 6]]
        },
        1: {
            large: ['ONESIXTHREE', [0, 4, 3]],
            medium: ['ONESIXTEN', [0, 3, 3]]
        },
        2: {
            large: ['FOURFIVETWO', [8, 4, 3]],
            medium: ['FOURKTWOS', [5, 3, 3]]
        },
        3: {
            large: ['ONESIXTHREE', [6, 4, 5]],
            medium: ['FIVETHREE', [4, 3, 5]]
        },
        4: {
            large: ['FOURFIVETWO', [0, 4, 4]],
            medium: ['FOURKTWOS', [0, 3, 4]]
        },
        5: {
            large: ['FOURFIVETWO', [4, 4, 4]],
            medium: ['FIVETHREE', [0, 3, 4]]
        },
        6: {
            large: ['ONESIXTHREE', [3, 4, 3]],
            medium: ['ONESIXTEN', [3, 3, 3]]
        },
        7: {
            large: ['SEVENTWELVE', [0, 4, 5]],
            medium: ['SEVENNINE', [0, 3, 5]]
        },
        8: {
            large: ['EIGHTELEVEN', [0, 4, 5]],
            medium: ['EIGHTERUC', [0, 3, 5]]
        },
        9: {
            large: ['TENYNUININE', [7, 4, 4]],
            medium: ['SEVENNINE', [5, 3, 4]]
        },
        10: {
            large: ['TENYNUININE', [0, 4, 3]],
            medium: ['ONESIXTEN', [6, 3, 3]]
        },
        11: {
            large: ['EIGHTELEVEN', [5, 4, 6]],
            medium: ['DCAELEVEN', [3, 3, 6]]
        },
        oclock: {
            large: ['OCLOCKEAMPM', [0, 5, 6]],
            medium: ['', [0, 0, 0]],
            small: ['', [0, 1, 5]]
        },
        am: {
            large: ['OCLOCKEAMPM', [7, 5, 2]],
            medium: ['QLOCKAMPM', [5, 4, 2]],
            small: ['AM|PM', [0, 2, 2]]
        },
        pm: {
            large: ['OCLOCKEAMPM', [9, 5, 2]],
            medium: ['QLOCKAMPM', [7, 4, 2]],
            small: ['AM|PM', [3, 2, 2]]
        }
    },

    small_word_map: {
        it: ['ITLIS', [0, 0, 2]],
        is: ['ITLIS', [3, 0, 2]],
        time: ['', [0, 1, 5]],
        am: ['AM|PM', [0, 2, 2]],
        pm: ['AM|PM', [3, 2, 2]]
    },

    mini_qlock_map: {
        it: ['ITLIS', [0, 0, 2]],
        is: ['ITLIS', [3, 0, 2]],
        time: ['MINID', [0, 1, 4]],
        am: ['QLOCK', [0, 2, 5]],
        pm: ['QLOCK', [0, 2, 5]]
    },


    always_lit: ['it', 'is'],
    previous_words: [],
    mode: "large",

    get_random_letter: function() {
        return qlock.alphabet[Math.floor(Math.random() * qlock.alphabet.length)];
    },

    generate_tables: function() {
        var clock = document.getElementById('clock');
        for (var y = 0; y < 6; y++) {
            var div = document.createElement('div');
            div.setAttribute('id', 'row-' + y);
            div.setAttribute('class', 'row');
            for (var x = 0; x < 11; x++) {
                var cell = document.createElement('span');
                cell.setAttribute('id', 'large-cell-' + x + '-' + y);
                cell.setAttribute('class', 'cell');
                cell.innerHTML = qlock.initial_rows[y][x];
                div.appendChild(cell)
                div.innerHTML += ' ';
            }
            clock.appendChild(div);
        }

        var medium_clock = document.getElementById('medium-clock');
        for (var y = 0; y < 5; y++) {
            var div = document.createElement('div');
            div.setAttribute('id', 'm-row-' + y);
            div.setAttribute('class', 'row');
            for (var x = 0; x < 9; x++) {
                var cell = document.createElement('span');
                cell.setAttribute('id', 'medium-cell-' + x + '-' + y);
                cell.setAttribute('class', 'cell');
                cell.innerHTML = qlock.initial_medium_rows[y][x];
                div.appendChild(cell)
                div.innerHTML += ' ';
            }
            medium_clock.appendChild(div);
        }

        var small_clock = document.getElementById('small-clock');
        for (var y = 0; y < 3; y++) {
            var div = document.createElement('div');
            div.setAttribute('id', 's-row-' + y);
            div.setAttribute('class', 'row');
            for (var x = 0; x < 5; x++) {
                var cell = document.createElement('span');
                cell.setAttribute('id', 'small-cell-' + x + '-' + y);
                cell.setAttribute('class', 'cell');
                cell.innerHTML = qlock.initial_small_rows[y][x];
                div.appendChild(cell)
                div.innerHTML += ' ';
            }
            small_clock.appendChild(div);
        }

    }, // end generate_table

    update: function() {
        if (qlock.mode == 'small') {
            words = qlock.update_small();
        } else {
            words = qlock.update_medium_n_large();
        }

    }, // end update

    update_small: function() {
        var date = new Date(),
            hour = date.getHours(),
            min = date.getMinutes(),
            lights = ['oclock'];

        if (hour > 11) {
            lights.push('pm');
            hour -= 12;
        } else {
            lights.push('am');
        }

        if (!hour)
            hour = 12;

        qlock.assign_row(1, format_time(hour) + ':' + format_time(min));
        qlock.light(lights);
    }, // end update_small

    update_medium_n_large: function() {
        var date = new Date(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds(),
            am = true,
            use_past = true,
            top_of_the_hour = false,
            lights = [];

        if (min > 32) { // We only ever say "Half Past"
            use_past = false;
            min = 30 - (min - 30)
        }
        if (min > 27) {
            lights.push('half');
        } else if (min > 22) {
            lights.push('twenty');
            lights.push('five');
        } else if (min > 17) {
            lights.push('twenty');
        } else if (min > 12) {
            lights.push('a');
            lights.push('quarter');
        } else if (min > 7) {
            lights.push('ten');
        } else if (min > 2) {
            lights.push('five');
        } else {
            if (qlock.mode == 'large')
                lights.push('oclock');
            top_of_the_hour = true;
        }

        if (!top_of_the_hour) {
            if (use_past) {
                lights.push('past');
            } else {
                lights.push('to');
                hour += 1; // We're talking about the next hour, not the current
            }
        } else {
            // We need to account for the fact the hour hasn't changed yet.
            if (0 < min <= 2 && !use_past) {
                hour += 1;
            }
        }

        // Special case for times after 23:30
        // Date objects return hours between 0-23 so we need to force it
        // back into that.
        if (hour == 24) {
            am = true;
            hour = 0;
        }

        if (hour > 11) {
            am = false;
            hour -= 12;
        }

        lights.push(hour);

        if (am) {
            lights.push('am');
        } else {
            lights.push('pm');
        }

        if (lights != qlock.previous_words) {
            qlock.setup_grid(lights);
            qlock.light(lights);
            qlock.previous_words = lights;
        }
    }, // end update_medium_n_large

    assign_row: function(row, string) {
        for (var i in string) {
            var c = string[i],
                cell = document.getElementById(qlock.mode + '-cell-' + i + '-' + row);
            cell.innerHTML = c;
        }
    }, // end assign_row

    setup_grid: function(words) {
        var word,
            word_data,
            row;

        words = qlock.always_lit.concat(words);
        for (i in words) {
            word = words[i];
            word_data = qlock.word_map[word][qlock.mode];
            row = word_data[1][1];
            if (word_data[0]) {
                qlock.assign_row(row, word_data[0]);
            }
        }

        qlock.clear_lights();
    }, // end setup_grid

    clear_lights: function() {
        var lit = document.getElementsByClassName('lit');
        for (var i = 0, l = lit.length; i < l; i++) {
            lit[0].classList.remove('lit');
        }
    }, // end clear_lights

    light: function(words) {
        var i, x, y,
            word,
            word_data,
            cell,
            word_map;

        if (qlock.mode == 'large') {
            word_map = qlock.word_map;
        } else if (qlock.mode == 'medium') {
            word_map = qlock.medium_word_map;
        } else {
            word_map = qlock.small_word_map;
        }

        words = qlock.always_lit.concat(words);
        word_map = qlock.word_map;
        for (i in words) {
            word = words[i];
            word_data = word_map[word][qlock.mode][1];
            x = word_data[0]
            y = word_data[1]
            for (var l = word_data[0] + word_data[2]; x < l; x++) {
                cell = document.getElementById(qlock.mode + '-cell-' + x + '-' + y);
                cell.classList.add('lit');
            }
        }
    } // end light
} // end qlock

window.addEventListener('resize', function() { find_and_set_mode(); }, false);

window.addEventListener('load', function() {
    qlock.generate_tables();
    find_and_set_mode();

    var last_minute = -1;
    // Get and display the current time every 20 seconds
    var timer = window.setInterval(function() {
        var min = new Date().getMinutes();

        // There's no changes between minutes.
        if (qlock.previous_minute != min) {
            qlock.previous_minute = min
            qlock.update();
        }

    }, 20000); // Three times a minute should be enough accuracy, no?
}, false);