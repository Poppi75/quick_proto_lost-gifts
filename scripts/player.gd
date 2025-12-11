# Player.gd
extends CharacterBody3D

@export var forward_speed: float = 15   # Constant forward speed
@export var lift_speed: float = 8      # Up/down speed
@export var turn_speed: float = 3       # Rotation speed (radians/sec)

func _physics_process(delta):
	# Vertical movement (global Y)
	var vertical = 0.0
	if Input.is_action_pressed("up"):       # Up
		vertical += 1
	if Input.is_action_pressed("down"):  # Down
		vertical -= 1

	# Apply vertical speed
	velocity.y = vertical * lift_speed

	# Rotate sleigh left/right
	if Input.is_action_pressed("left"):
		rotate_y(turn_speed * delta)
	if Input.is_action_pressed("right"):
		rotate_y(-turn_speed * delta)

	# Constant forward motion in local Z direction
	var forward_dir = -transform.basis.z  # Local forward
	velocity.x = forward_dir.x * forward_speed
	velocity.z = forward_dir.z * forward_speed

	# Apply movement
	move_and_slide()
