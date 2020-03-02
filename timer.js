class Timer {
    getIntId () {
        let intId = setInterval(()=> {
            this.updateClock();
        }, 1000);
        return intId;
    }
    clear () {
        let id = this.getIntId();
        for (var i = 1; i < id + 1; i++) {
            window.clearInterval(i);
        }
    }
    triggerClock () {
        $(".trigger").on("click", (e) => {
            let id = $(e.target).attr("data-id");
            let timerStart = () => {
                let timeVal = parseInt( $("#" + id).val() ); 
                timeVal = timeVal !== 1? timeVal - 1 : "0";
                // timeBox.setClock(timeVal, 59);
                timeBox.setMode(id);
                console.log(timeBox.getMode());
                timeBox.setClock(timeVal, 3); //test
                this.timerGo();
            };

           if (id !== "stop") {
                timerStart();
           } else {
                this.timerStop();
           }
        });
    }
    updateClock () {
        let currentMin = parseInt($("#min").text());
        let currentSec = parseInt($("#sec").text());
        let sec = currentSec !== 1? currentSec - 1 : "0";
        let min = currentMin !== 1? currentMin -1 : "0";
        if (currentSec < 10 ) {
            if (currentSec === 0) {
                if (currentMin !== 0) {
                    timeBox.setClock(min, 59); 
                } else {
                   this.finish(timeBox.getMode());
                }
            } else {
                timeBox.setClock(null, sec);
            }
        } else {
            timeBox.setClock(null, sec);
        }
    }
    timerGo () {
        this.clear();
        setInterval(()=> {
            this.updateClock();
        }, 1000);
    }

    timerStop () {
        this.clear();
        timeBox.setMode("unset");
        timeBox.setClock("0", "0");
    }
    updateValues () {
        $(".timevalues input").on("change", (e) => {
            $(e.target).attr("value", $(e.target).val());
        });
        $(".finish-opts label").on("click", function (e) {
            if (e.target.tagName !== "INPUT") {
                let item = e.target.tagName === "LABEL" ? e.target : $(e.target).parent();
                $(item.control).find("input").attr("checked", true);
    
                $(item).toggleClass("checked")
                .toggleClass("border")
                .toggleClass("border-danger")
                .find(".tomato").toggleClass("checked");
            }
           
        });
        $(".finish-opts input").on("change", (e) => {
            timeBox.clearOpts();
            let opts = [];
            $(".finish-opts input:checked").each((el) => {
                let item = $(".finish-opts input:checked")[el];
                let val = $(item).attr("id");
                timeBox.addOpt(val);
                console.log(val);
            });
          
        });
    }
    finish (mode) {
        this.clear();
        if ($.inArray("beep", timeBox.opts) !== -1) {
            let beep = $("#beep-sound")[0];
            beep.play();
        }
        if ($.inArray("msg", timeBox.opts) !== -1) {
            console.log("mesg");
        }
        if ($.inArray("break", timeBox.opts) !== -1 && mode === "timeblock") {
            $("div[data-id='shortbreak']").trigger("click");
        }
    }
    init () {
        this.updateValues();
        this.triggerClock();
    }
}
const timeBox = {
    mode: "unset",
    opts: [],
    setMode: (mode) => {
        this.mode = mode;
    },
    getMode: () => {
        return this.mode;
    },
    getOpts: () => {
        return this.opts;
    },
    addOpt: (val) => {
        timeBox.opts.push(val);
    },
    clearOpts: () => {
        timeBox.opts = [];
    },

    setClock: (min, sec) => {
        min = min? (min < 10? "0" + min : min) : $("#min").text();
        sec = sec? (sec < 10? "0" + sec : sec) : $("#sec").text();
        $("#min").text(min);
        $("#sec").text(sec);
    }
};
new Timer().init();