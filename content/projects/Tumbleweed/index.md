---
index: 4
type: project
title: Tumbleweed
date: 'Aug. 2022 - Dec. 2022 | Prototype'
description: 'Movement Based First Person Shooter'
tools: 'Unity Universal Rendering Pipeline'
---
This project started in a game design project class (no code supervision, just gameplay suggestions / game testing in class time). Most complex game I've worked on so far, despite it being a prototype. Created the entire first-person controller from scratch and implemented physics based shooting with drag. The FPS controller is able to wall jump, slide, and lean.

The scope of the game is a bit out of reach for me to do alone. I intended the R (or North on controller) button to not be a reload, and the game to not be a traditional FPS (although you will find out that it is already a bit nontraditional, even understanding the controls). Instead, players would have a deck of cards where each card is a special weapon, and pressing R (or running out of ammo) would switch to that weapon.

In the original prototype, local split screen co-op is supported. It also supports controller and keyboard (though I haven't had the opportunity to test controller support through the WebGL build below).

Honestly think this project has legs given enough time / a team. Me and some friends enjoyed it as much a lot more than other FPS games when playing split screen on the TV, it's a genre that's became a bit stale. The co-op gameplay was very fast paced and although the diversity in guns wasn't much, it provided enough stimulation to make the game more enjoyable than it would seem.

Music by Stephon Brown
Level Design by Thia Broido
#### *Scroll to the bottom for (unoptimized for web) playable demo and video*
## Implementation Details
#### Camera Controller
Basic camera controller with some modifications to handle tilt. A held weapon was made as a child of the camera to make sure the bullets were consistent with the player POV.

```cs
void RotateMainCamera()
{
    Vector2 mouseInput = controllerManager.CameraInput;
    mouseInput.x *= sensX;
    mouseInput.y *= sensY;

    currentLook.x += mouseInput.x;
    currentLook.y = Mathf.Clamp(currentLook.y += mouseInput.y, -90, 90);

    Quaternion lastRot = transform.localRotation;
    transform.localRotation = Quaternion.AngleAxis(-currentLook.y, Vector3.right);
    transform.localEulerAngles = new Vector3(transform.localEulerAngles.x, transform.localEulerAngles.y, curTilt);
    transform.root.transform.localRotation = Quaternion.Euler(0, currentLook.x, 0);
}
```
Here I convert the  mouse input into camera rotation.

The mouse input, which is a 2D vector representing the rotation along the X (pitch) and Y (yaw) axes, is converted into two quaternions.

Quaternion.AngleAxis(-currentLook.y, Vector3.right) creates a quaternion representing rotation around the X-axis (Vector3.right). The negative sign is used to ensure that the rotation is in the correct direction (pitch).

Quaternion.Euler(0, currentLook.x, 0) creates a quaternion representing rotation around the Y-axis for yaw.

Quaternion math was essential here for smooth rotations without gimbal lock issues.

I had to do this all manually to compensate for the simplicity of my lean function, which was a lerp in FixedUpdate()

```cs
fov = Mathf.Lerp(fov, baseFov, fovTimer / 0.5f);
fov = Mathf.Clamp(fov, baseFov, maxFov);
mainCamera.fieldOfView = fov;

currentLook = Vector2.Lerp(currentLook, currentLook + sway, 0.8f);
curTilt = Mathf.LerpAngle(curTilt, wishTilt * wallRunTilt, 0.1f);

sway = Vector2.Lerp(sway, Vector2.zero, 0.2f);
fovTimer += Time.fixedDeltaTime;
```

#### Controller Manager
I made a comprehensive input manager using the new Unity input system that would make referencing inputs much easier for my other scripts.

The class also gives an overview of what users were capabale of
```cs
public void OnWorldMove(InputAction.CallbackContext ctx) => movementInput = ctx.ReadValue<Vector2>();
public void OnCameraMove(InputAction.CallbackContext ctx) => cameraInput = ctx.ReadValue<Vector2>();
public void OnSprint(InputAction.CallbackContext ctx) => sprint = ctx.ReadValue<float>() > .1f;
public void OnLeanLeft(InputAction.CallbackContext ctx) => leanLeft = ctx.ReadValue<float>() > .1f;
public void OnLeanRight(InputAction.CallbackContext ctx) => leanRight = ctx.ReadValue<float>() > .1f;
public void OnAim(InputAction.CallbackContext ctx) => aim = ctx.ReadValue<float>() > .1f;
public void OnFire(InputAction.CallbackContext ctx) => fire = ctx.ReadValue<float>() > .1f;
public void OnCrouch(InputAction.CallbackContext ctx) => crouch = ctx.ReadValue<float>() > .1f;
public void OnJump(InputAction.CallbackContext ctx) => jump = ctx.performed;
public void OnAbility1(InputAction.CallbackContext ctx) => ability1 = ctx.performed;
public void OnAbility2(InputAction.CallbackContext ctx) => ability2 = ctx.performed;
public void OnSensUp(InputAction.CallbackContext ctx) => sensUp = ctx.performed;
public void OnSensDown(InputAction.CallbackContext ctx) => sensDown = ctx.performed;

public Vector2 MovementInput { get { return movementInput; } }
public Vector2 CameraInput { get { return cameraInput; } }
public bool Sprint { get { return sprint; } }
public bool LeanLeft { get { return leanLeft; } }
public bool LeanRight { get { return leanRight; } }
public bool Aim { get { return aim; } }
public bool Fire { get { return fire; } }
public bool Jump { get { return jump; } }
public bool Crouch { get { return crouch; } }
public bool Ability1 { get { return ability1; } }
public bool Ability2 { get { return ability2; } }
public bool SensUp { get { return sensUp; } }
public bool SensDown { get { return sensDown; } }
```
If you're wondering why sensitivity was an input, that was for testing purposes before the menu system

#### Gun Movement
One thing I realized really helps with game feel in FPS games is gun sway, and I implemented this with basic quaternion rotation. Aim down sights was just interpolating the gun's position between specified hip and ADS positions

```cs
void Update()
{
    if (controllerManager.Aim) {
        crosshair.SetActive(false);
        camController.SetFov(70f);
    } else {
        crosshair.SetActive(true);
        if (controllerManager.Sprint) {
            camController.SetFov(90f);
        } else {
            camController.SetFov(80f);
        }
        
    }
    
    if ((controllerManager.Sprint || movement.mode == Movement.Mode.Vaulting) && !controllerManager.Aim) {
        transform.position = Vector3.Lerp(transform.position, sprintObj.transform.position, Time.deltaTime * aimSpeed);
    } else {
        Aim(controllerManager.Aim);
    }
    UpdateSway();
}

void Aim(bool ads)
{
    if (ads) {
        transform.position = Vector3.Lerp(transform.position, adsObj.transform.position, Time.deltaTime * aimSpeed);
        adsSound.Play();
    } else {
        transform.position = Vector3.Lerp(transform.position, hipObj.transform.position, Time.deltaTime * aimSpeed);
    }
}

void UpdateSway()
{
    float t_x_mouse = controllerManager.CameraInput.x * camController.sensX;
    float t_y_mouse = controllerManager.CameraInput.y * camController.sensY;

    Quaternion t_x_adj = Quaternion.AngleAxis(-intensity * t_x_mouse, Vector3.up);
    Quaternion t_y_adj = Quaternion.AngleAxis(intensity * t_y_mouse, Vector3.right);
    Quaternion target_rotation = origin_rotation * t_x_adj * t_y_adj;

    transform.localRotation = Quaternion.Lerp(transform.localRotation, target_rotation, Time.deltaTime * smooth);
}
```

#### Gun System
As for how a gun would actually work, I implemented a physics style shooting mechanism that would instatiate bullets with a specified spread and drop rate

```cs
private void OnInput()
{
    if (allowButtonHold) shooting = controllerManager.Fire;
    else shooting = !shooting && controllerManager.Fire;

    if (readyToShoot && shooting && bulletsLeft > 0){
        bulletsShot = bulletsPerTap;
        Shoot();
    }

    shooting = controllerManager.Fire;
}

private void Shoot()
{
    readyToShoot = false;

    //Spread
    float x = Random.Range(-spread, spread);
    float y = Random.Range(-spread, spread);
    float z = Random.Range(-spread, spread);

    //Calculate Direction with Spread
    Vector3 direction = fpsCam.transform.forward + new Vector3(-x, -y, -z);
    //Graphics
    GameObject bullet = Instantiate(bulletPref, attackPoint.position, attackPoint.rotation);
    ParabolicBullet bulletScript = bullet.GetComponent<ParabolicBullet>();
    if (bulletScript) {
        bulletScript.Initialize(attackPoint, speed, gravity, damage, gameObject, hitmarker, bulletType);
        audioSource.PlayOneShot(gunshot);
    }
    Destroy(bullet, bulletLifetime);
    
    bulletsLeft--;
    bulletsShot--;

    if(!IsInvoking("ResetShot") && !readyToShoot)
    {
        Invoke("ResetShot", timeBetweenShooting);
    }

    if(bulletsShot > 0 && bulletsLeft > 0)
    Invoke("Shoot", timeBetweenShots);
}

private void ResetShot()
{
    readyToShoot = true;
}
```

For phsyics based gunplay, I just made a parabolic bullet trajectery using gravity. It would make repetetive raycasts for collision detection across the trajectory

```cs
private Vector3 FindPointOnParabola(float curTime)
{
    Vector3 point = startPosition + (startForward * speed * curTime);
    Vector3 gravityVec = Vector3.down * gravity * curTime * curTime;
    return point + gravityVec;
}

private bool CastRayBetweenPoints(Vector3 startPoint, Vector3 endPoint, out RaycastHit hit)
{
    return Physics.Raycast(startPoint, endPoint - startPoint, out hit, (endPoint - startPoint).magnitude);
}

private void FixedUpdate()
{
    if (!isInitialized) return;
    if (time < 0) time = Time.time;

    RaycastHit hit;
    float currentTime = Time.time - time;
    float nextTime = currentTime + Time.fixedDeltaTime;

    Vector3 currentPoint = FindPointOnParabola(currentTime);
    Vector3 nextPoint = FindPointOnParabola(nextTime);

    if (CastRayBetweenPoints(currentPoint, nextPoint, out hit)) {
        if (hit.collider.gameObject != owner && hit.collider.tag == "Player") {
            hit.collider.gameObject.GetComponent<PlayerSystem>().Damage(dmg, hitmarker);
        }
        Destroy(gameObject);
    }
}
```

#### Movement  
Players could be in a states of walking, jumping, sliding, or wall running (or standing still). I managed this with a simple state machine. For the wall running, I applied a perpendicular force to the wall and froze gravity.

It starts by assigning empty game objects as spawn positions, and randomy setting the player position there
```cs
private void Awake() {
    spawnPosVecs = new Vector3[8];
    int i = 0;
    foreach (GameObject position in spawnPositions) {
        spawnPosVecs[i] = position.transform.position;
        ++i;
    }
    var rnd = new System.Random();
    spawnPosVecs = spawnPosVecs.OrderBy(x => rnd.Next()).ToArray(); 
    abilities = abilities.OrderBy(x => rnd.Next()).ToArray(); 
}
```

The movement state machine
```cs
 private void FixedUpdate() 
    {
        if (!crouched) {
            canSlide = true;
        }
        if (crouched) {
            if (col.height == 1.8f) { // Push to floor after shrinking size
                rb.AddForce(Vector3.down * 10f, ForceMode.Impulse);
            }
            col.height = Mathf.Max(0.6f, col.height - Time.deltaTime * 10f);
            if (running && !sliding && slideTimer <= 0f && canSlide && (new Vector3(rb.velocity.x, 0f, rb.velocity.z)).magnitude > slideStartSpeed) {
                EnterSliding();
            }
        } else if (col.height < 1.8f) {
            if (sliding) ExitSliding();
            col.height = col.height + 0.2f > 1.8f ? 1.8f : Mathf.Min(1.8f, col.height + Time.deltaTime * 10f);
        }

        if (wallStickTimer == 0f && wallBan > 0f) {
            bannedGroundNormal = groundNormal;
        } else {
            bannedGroundNormal = Vector3.zero;
        }

        slideTimer -= Time.deltaTime;

        wallStickTimer = Mathf.Max(wallStickTimer - Time.deltaTime, 0f);
        wallBan = Mathf.Max(wallBan - Time.deltaTime, 0f);

        if (crouched && sliding && mode == Mode.Walking && slideTimer > 0f) {
            mode = Mode.Sliding;
        }

        CheckForVault();
        if (rb.isKinematic) {
            mode = Mode.Vaulting;
        } else {
            vaultCooldown += Time.deltaTime;
        }
        switch (mode) {
            case Mode.Sliding:
                rb.drag = 1;
                Sliding(dir, runSpeed, grAccel * slideAccelMult);
                break;

            case Mode.Wallruning:
                rb.drag = 1;
                Wallrun(dir, wallSpeed, wallClimbSpeed, wallAccel);
                if (ground.tag != "InfiniteWallrun") wrTimer = Mathf.Max(wrTimer - Time.deltaTime, 0f);
                break;

            case Mode.Walking:
                Walk(dir, running && !aimed? runSpeed : groundSpeed, grAccel);
                break;

            case Mode.Flying:
                rb.drag = 1;
                AirMove(dir, airSpeed, airAccel);
                break;

            case Mode.Vaulting:
                rb.drag = 1;
                Vault();
                break;
        }
        // DEBUG
        if (jump) {
            metricManager.AddToMetric1(gameObject.transform.position.x);
            metricManager.AddToMetric2(gameObject.transform.position.z);
        }

        jump = false;
    }
```

For wallrunning, I constantly check if the player is in contact with with another object
`Vector3.Angle(contact.normal, Vector3.up)` calculates the angle between the surface normal at the point of contact and the vertical axis of the game world, determining whether the player is colliding with a wall or the ground
- If `angle < wallFloorBarrier`, the surface is considered a floor, and the player enters the walking state.
- If `angle > wallFloorBarrier && angle < 120f`, the surface is considered a wall suitable for wall-running.

```cs
private void OnCollisionStay(Collision collision)
{
    if (collision.contactCount > 0) {
        float angle;

        foreach (ContactPoint contact in collision.contacts) {
            angle = Vector3.Angle(contact.normal, Vector3.up);
            if (angle < wallFloorBarrier) {
                EnterWalking();
                grounded = true;
                groundNormal = contact.normal;
                ground = contact.otherCollider;
                return;
            }
            if (contact.otherCollider.tag != "floor" && contact.otherCollider.tag != "Player" && mode == Mode.Sliding) {
                ExitSliding();
            }
        }

        if (VectorToGround().magnitude > 0.2f) {
            grounded = false;
        }

        if (grounded == false) {
            foreach (ContactPoint contact in collision.contacts) {
                if (contact.otherCollider.tag != "NoWallrun" && contact.otherCollider.tag != "Player" && mode != Mode.Walking) {
                    angle = Vector3.Angle(contact.normal, Vector3.up);
                    if (angle > wallFloorBarrier && angle < 120f) {
                        grounded = true;
                        groundNormal = contact.normal;
                        ground = contact.otherCollider;
                        EnterWallrun();
                        return;
                    }
                }
            }
        }
    }
}
```

The math behind all the movement functions individually is pretty simple and essentially just sets values in the vector3 matrix to constant values depending on the state.

Another big game feel implementation, like gun sway, was head bobbing, which was done with  sinusoidal interpolation
```cs
private void CheckMotion()
{
    if (movement.mode == Movement.Mode.Walking && rb.velocity.magnitude > toggleSpeed) {
        freq = frequency + (frequency * (rb.velocity.magnitude * (1 / sprintChange)));
        PlayMotion(FootStepMotion());
    }
}

private Vector3 FootStepMotion()
{
    Vector2 pos = Vector2.zero;
    pos.y += Mathf.Sin(Time.time * freq) * amplitude;
    pos.x += Mathf.Cos(Time.time * freq / 2) * amplitude * 2;
    return pos;
}

private void PlayMotion(Vector2 motion){
    camController.Punch(motion); 
}
```

#### Other
I also ended up writing a way to track and save game metrics, which I would create a heatmap with to determine how players were interacting with the map.

```cs
public class MetricManager : MonoBehaviour
{
    // TODO: Add more interesting metrics
    private float jumpPosX;
    private float jumpPosY;

    public void AddToMetric1 (float valueToAdd)
    {
        jumpPosX += valueToAdd;
    }

    public void AddToMetric2 (float valueToAdd)
    {
        jumpPosY += valueToAdd;
    }

    // Converts all metrics tracked in this script to their string representation
    // so they look correct when printing to a file.
    private string ConvertMetricsToStringRepresentation ()
    {
        string metrics = "Here are my metrics:\n";
        metrics += "Metric 1: " + jumpPosX.ToString () + "\n";
        metrics += "Metric 2: " + jumpPosY.ToString () + "\n";
        return metrics;
    }

    // Uses the current date/time on this computer to create a uniquely named file,
    // preventing files from colliding and overwriting data.
    private string CreateUniqueFileName ()
    {
        string dateTime = System.DateTime.Now.ToString ();
        dateTime = dateTime.Replace ("/", "_");
        dateTime = dateTime.Replace (":", "_");
        dateTime = dateTime.Replace (" ", "___");
        return "YourGameName_metrics_" + dateTime + ".txt"; 
    }
    
    private void WriteMetricsToFile ()
    {
        string totalReport = "Report generated on " + System.DateTime.Now + "\n\n";
        totalReport += "Total Report:\n";
        totalReport += ConvertMetricsToStringRepresentation ();
        totalReport = totalReport.Replace ("\n", System.Environment.NewLine);
        string reportFile = CreateUniqueFileName ();

        #if !UNITY_WEBPLAYER 
        File.WriteAllText (reportFile, totalReport);
        #endif
    }

    private void OnApplicationQuit ()
    {
        WriteMetricsToFile ();
    }
}
```

And here's some player system functions
```cs
void Update()
{
    healthBar.value = health / maxHealth;
    lastHitTimer += Time.deltaTime;
    if (hitmarker != null && lastHitTimer > 0.1f ) {
        hitmarker.SetActive(false);
        damageIndicator.SetActive(false);
    }
    
    GunSystem system1 = ability1.GetComponent<GunSystem>();
    GunSystem system2 = ability2.GetComponent<GunSystem>();
    if (system1.change) {
        system1.change = false;
        ability1.SetActive(false);
        pos = (pos + 1) % 8;
        pos = abilities[pos] == ability2 ? pos + 1 : pos;
        ability1 = abilities[pos];
        current = ability1;
        current.SetActive(true);
    }
    if (system2.change) {
        system2.change = false;
        ability2.SetActive(false);
        pos = (pos + 1) % 8;
        pos = abilities[pos] == ability1 ? pos + 1 : pos;
        ability2 = abilities[pos];
        current = ability2;
        current.SetActive(true);
    }
}


void FixedUpdate()
{
    cooldownTimer += Time.fixedDeltaTime;
    if (health <= 0f || gameObject.transform.position.y < -20f) {
        deathSound.Play();
        health = 100f;
        gameObject.transform.position = spawnPosVecs[spawnPos];
        spawnPos = (spawnPos + 1) % spawnPosVecs.Length;
        ++deaths;
        deathsText.text = "Deaths: " + deaths;
    }

    if (health < 100f && lastHitTimer > 5f) {
        if (Time.time >= lastHealTime + 0.05f) {
            if (!healSound.isPlaying) {
                healSound.Play();
            }
            health += 1f;
            lastHealTime = Time.time;
        }
    } else if (healSound.isPlaying) {
            healSound.Stop();
    }

    if (controller.Ability1) {
        current.SetActive(false);
        if (current == ability1 && cooldownTimer > weaponCooldown) {
            pos = (pos + 1) % 8;
            pos = abilities[pos] == ability2 ? pos + 1 : pos;
            ability1 = abilities[pos];
        } else if (current != ability1) {
            current = ability1;
            cooldownTimer = 0f;
        }
        current.SetActive(true);
    } else if (controller.Ability2) {
        current.SetActive(false);
        if (current == ability2 && cooldownTimer > weaponCooldown) {
            pos = (pos + 1) % 8;
            pos = abilities[pos] == ability1 ? pos + 1 : pos;
            ability2 = abilities[pos];
        } else if (current != ability2) {
            current = ability2;
            cooldownTimer = 0f;
        }
        current.SetActive(true);
    }
}

public void Damage(float dmg, GameObject hitmarker)
{
    health -= dmg;
    lastHitTimer = 0f;
    hitmarker.SetActive(true);
    damageIndicator.SetActive(true);
    this.hitmarker = hitmarker;
    hitsound.Play();
    // TODO: gradually cover screen in blood as the player takes damage
}
```




### Instructions
This game is meant for more seasoned FPS players, as it does not have a fleshed out tutorial.

#### Basic Movement
- Move around with WASD and look around with your mouse
- Jump around with space; you can jump towards a wall and if you jump at the right time can wall jump (or sort of climb) the wall

#### Advanced Movement
- Sprint with shift
- Crouch with C; if you crouch while sprinting, you will slide
- Lean with Q/E

#### Misc
- Switch weapons with R (it has a cooldown, this was intended to be a feature not a bug! but it is not fleshed out)

#### NOTE
As a web build it is TERRIBLY OPTIMIZED to run purely on CPU via WASM. There is significant delay; this demo is truly here to be a demo. Oh, and you might have to alt+tab to escape out of the game (or CMD+tab on mac)

<iframe src="https://i.simmer.io/@trooms/tumbleweed" style="width:960px;height:600px"></iframe>

## Trailer
Here is some actual gameplay and a trailer we made for a games class at usc
<iframe width="420" height="315"
src="https://www.youtube.com/embed/hmuE7-T4zCE?autoplay=1&mute=1&loop=1&controls=0&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=hmuE7-T4zCE">
</iframe>




