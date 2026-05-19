// @ts-check

/**
 * @typedef {"Ready" | "Charging" | "Mighty Charge" | "Leap" | "BIG Bounce" | "Belly-Slide" | "Trunk-Smash" | "Spin Attack" | "Jungle Bump" | "Herd Resting" | "Jungle Gate"} PlayerStateLabel
 */

/**
 * Mutable gameplay state for the player-controlled elephant.
 *
 * @typedef {object} PlayerBody
 * @property {number} localX Lateral position relative to the track centerline.
 * @property {number} x World-space X position.
 * @property {number} y World-space Y position.
 * @property {number} z World-space Z position.
 * @property {number} speed Forward speed along the course.
 * @property {number} yVelocity Vertical velocity used for jumps and falls.
 * @property {number} coyoteTimer Remaining jump grace period after leaving the ground.
 * @property {number} jumpBufferTimer Remaining buffered jump time.
 * @property {boolean} grounded Whether the player is currently on the ground.
 * @property {boolean} jumpHeld Whether the jump/slide input is held this frame.
 * @property {boolean} doubleUsed Whether the air jump has been spent.
 * @property {number} spaceHeldTimer How long the jump/slide input has been held.
 * @property {boolean} spaceActionResolved Whether the current space press has already produced an action.
 * @property {boolean} bufferedSlide Whether a slide should start on landing.
 * @property {number} slideTimer Remaining belly-slide time.
 * @property {number} hurtTimer Remaining damage stun/invulnerability time.
 * @property {number} smashTimer Remaining trunk-smash effect time.
 * @property {number} smashActionTimer Remaining smash input cooldown.
 * @property {number} spinTimer Remaining spin attack time.
 * @property {number} yaw Render yaw for the player model.
 * @property {number} health Current health value.
 * @property {number} lives Remaining lives.
 * @property {number} fruit Collected fruit count.
 * @property {number} fruitLifeCounter Progress toward fruit-based extra life rewards.
 * @property {number} crates Smashed crate count.
 * @property {number} score Current score.
 * @property {number} multiplier Active score multiplier.
 * @property {number} multiplierCombo Number of chained multiplier pickups/actions.
 * @property {number} multiplierTimer Remaining multiplier duration.
 * @property {PlayerStateLabel | string} state UI state label.
 * @property {boolean} completed Whether the finish gate has been reached.
 * @property {string} lastPrompt Last tutorial prompt shown to the player.
 */

/**
 * Axis-aligned collider bounds in world space.
 *
 * @typedef {object} ColliderBox
 * @property {number} minX
 * @property {number} maxX
 * @property {number} minY
 * @property {number} maxY
 * @property {number} minZ
 * @property {number} maxZ
 */

/**
 * Center/extent collider source used to derive a {@link ColliderBox}.
 *
 * @typedef {object} ObstacleCollider
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} w
 * @property {number} h
 * @property {number} d
 */

/**
 * Shared authored metadata attached to generated level items.
 *
 * @typedef {object} LevelMetadata
 * @property {string} section
 * @property {string} [difficulty]
 * @property {string} [tutorialPrompt]
 */

/**
 * Collectible or restorative pickup placed on the course.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 *   y?: number,
 * }} Pickup
 */

/**
 * Fruit pickup with an explicit vertical position.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 *   y: number,
 * }} FruitPickup
 */

/**
 * Health recovery pickup.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 * }} HealthPickup
 */

/**
 * High-value collectible pickup.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 *   y: number,
 * }} CollectiblePickup
 */

/**
 * Static physical object placed on the course.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 *   width: number,
 *   height: number,
 *   depth: number,
 *   yOffset?: number,
 * }} LevelObject
 */

/**
 * Moving enemy path data.
 *
 * @typedef {LevelMetadata & {
 *   localX: number,
 *   z: number,
 *   patrolRange: number,
 *   patrolSpeed: number,
 *   baseLocalX: number,
 * }} EnemyObject
 */

/**
 * Crocodile timing data inside a river hazard.
 *
 * @typedef {object} CrocodileObject
 * @property {number} localX
 * @property {number} phase
 */

/**
 * River hazard and its crocodile pattern.
 *
 * @typedef {LevelMetadata & {
 *   z: number,
 *   width: number,
 *   depth: number,
 *   crocs: CrocodileObject[],
 * }} RiverObject
 */

/**
 * Generated course content consumed by rendering and collision systems.
 *
 * @typedef {object} LevelDefinition
 * @property {FruitPickup[]} fruits
 * @property {HealthPickup[]} health
 * @property {LevelObject[]} logs
 * @property {LevelObject[]} crates
 * @property {LevelObject[]} branches
 * @property {RiverObject[]} rivers
 * @property {EnemyObject[]} enemies
 * @property {CollectiblePickup[]} collectibles
 * @property {{ z: number }} gate
 * @property {{ z: number, failSafeZ: number }} finish
 */

export {};
