export default function Deferred() {
  this.resolve = null;
  this.reject = null;
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });

  Object.freeze(this);
}
