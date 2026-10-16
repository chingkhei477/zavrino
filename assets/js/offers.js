/*
 * Zavrino — live partner offers
 * ------------------------------------------------------------------
 * Add an offer here ONLY when the partnership is live and its tracking
 * has been tested. Every offer card on the Offers page is built from
 * this list. Leave the list empty when no offer is live — the page then
 * tells visitors so honestly.
 *
 * Fields (all text is shown exactly as written):
 *   id            unique short id, e.g. "store-electronics"
 *   store         store name as the partner allows it to be shown
 *   category      e.g. "Fashion", "Electronics", "Travel", "Food", "Beauty", "Home"
 *   rate          reward as agreed with the partner, e.g. "Up to 4% cashback" or "Flat ₹40 cashback"
 *   description   one short line about what the offer covers
 *   url           the partner's tracking link (must start with https://)
 *   logo          optional: path to a logo you are licensed to use, e.g. "assets/img/stores/name.svg"
 *   trackingTime  e.g. "Within 72 hours"
 *   confirmTime   e.g. "60–90 days"
 *   validTill     optional: "YYYY-MM-DD" — the card hides itself after this date
 *   conditions    list of reward conditions shown on the card
 *
 * Example (copy, then fill with real values from your partner agreement):
 *
 *   {
 *     id: "",
 *     store: "",
 *     category: "",
 *     rate: "",
 *     description: "",
 *     url: "https://",
 *     trackingTime: "",
 *     confirmTime: "",
 *     validTill: "",
 *     conditions: [""]
 *   }
 */
window.ZAVRINO_OFFERS = [];
