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
            let name = $(e.target).text().replace("Start", "").toLowerCase();

            let timerStart = () => {
                let inputId = id.replace("_", "");
                let timeVal = parseInt($("#" + inputId).val()); 
                timeBox.setMode(id);
                if (timeVal < 1 ) {
                    this.showMessage("The duration value of the " + name + " is wrong. Please check the settings");
                }else if ( $.inArray("break", timeBox.opts) && $("#shortbreak").val() < 1 && name.indexOf("Long") === -1) {

                    this.showMessage("Proceeding to Short Break is set, but its duration is wrong. Please check the settings.");
                } else {
                    timeBox.setClock(timeVal - 1, 59);
                    this.timerGo();
                }
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
            if ($(e.target).val() < 1) {
                let block = $(e.target).parent().text();
                this.showMessage("Heeeey! " + block + " can't be less than a minute!");
                $(e.target).attr("value", 1);
            } else {
                $(e.target).attr("value", $(e.target).val());
            }
            
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
            $(".finish-opts input:checked").each((el) => {
                let item = $(".finish-opts input:checked")[el];
                let val = $(item).attr("id");
                timeBox.addOpt(val);
            });
          
        });
    }
    showMessage(message) {
        $(".modal-msg").text(message);
        $("#msg-trigger").trigger("click");
    }
    finish (mode) {
        this.clear();

        let shortBreakNeeded = ($.inArray("break", timeBox.opts) !== -1 && mode === "time_block") ? true : false;
        if ($.inArray("beep", timeBox.opts) !== -1) {
            let beep = $("#beep-sound")[0];
            beep.play();
        }
        if ($.inArray("msg", timeBox.opts) !== -1) {
            if (mode.indexOf("_") === -1) return;
            let message = "The " + mode.replace("_", " ") + " ended.";

            if (shortBreakNeeded) {
                message += " Short break started";
            }
            this.showMessage(message);
        }
        if (shortBreakNeeded) {
            $("div[data-id='short_break']").trigger("click");
            setTimeout(()=> {
                $("#modal-close").trigger("click");
            }, 10000);
        }
    }
    showInfo () {
        $(".info-trigger").on("click", ()=> {
   
            $(".info-img").show();
            $(".modal-body h1").text("");
            $("#msg-trigger").trigger("click");
            $(".modal-dialog").animate({
                marginTop:"3rem",
                maxWidth: "1000px"
            }, 800);

            $(".modal-backdrop, #modal-close").on("click", ()=> {
                $(".tomatick-img").show();
                $(".info-img").hide();
                $(".modal-dialog").css({
                    marginTop: "10rem",
                    maxWidth: "500px"
                });
            });
        });
    }
    init () {
        this.updateValues();
        this.triggerClock();
        this.showInfo();
    }
}
const timeBox = {
    mode: "unset",
    opts: [],
    setMode: (mode) => {
        console.log(mode);
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
$(document).ready(()=> {
    $("label[for='beep']").trigger("click");
});
