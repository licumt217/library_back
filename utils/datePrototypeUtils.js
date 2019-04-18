
Date.prototype.toLocalDate=function () {
    let hours=this.getHours();
    this.setHours(hours+8);
    return this;
}
