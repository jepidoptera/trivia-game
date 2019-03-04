function timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        // don't restart a dead timer
        // if (remaining < 0) return;
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.clearTimeout = function() {
        clearTimeout(timerId);
    }
    this.resume();
}