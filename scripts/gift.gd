extends MeshInstance3D

signal collected



func _on_area_3d_body_entered(body: Node3D) -> void:
	if body.name == "player":
		emit_signal("collected")
		queue_free()
