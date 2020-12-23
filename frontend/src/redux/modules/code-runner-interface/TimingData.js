/**
 * Value class for tracking simple timing intervals
 */
export class TimingData {
  /**
   *
   * Timestamp at the start of the timer
   *
   * @type {number}
   */
  startTime = null;

  /**
   *
   * Timestamp at the end of the timer
   *
   * @type {number}
   */
  endTime = null;

  /**
   *
   * Elapsed time between startTime and endTime
   *
   * @type {number}
   */
  totalTime = null;

  /**
   * Begin a timing interval.
   * Sets the value of startTime
   *
   * @returns {TimingData}
   */
  start() {
    this.startTime = Date.now();
    return this;
  }

  /**
   * End a timing interval.
   *
   * Sets endTime and computes totalTime
   *
   * @returns {TimingData}
   */
  end() {
    this.endTime = Date.now();
    this.totalTime = this.endTime - this.startTime;
    return this;
  }
}
