namespace = purge_your_vassal_policy_menu3_readme.txt

purge_your_vassal_policy_menu3_readme.txt.1 = {
	type = country_event
	placement = ROOT

	trigger = {
		exists = scope:target_country
	}

	title = purge_your_vassal_policy_menu3_readme.txt_events.1.t
	desc = purge_your_vassal_policy_menu3_readme.txt_events.1.d

	event_image = {
		video = "gfx/event_pictures/unspecific_signed_contract.bk2"
	}

	on_created_soundeffect = "event:/SFX/UI/Alerts/event_appear"
	on_opened_soundeffect = "event:/SFX/Events/unspecific/signed_contract"

	icon = "gfx/interface/icons/event_icons/event_default.dds"

	duration = 1

	immediate = {
	}
    
	option = {
		name = CANCEL
		default_option = yes
		remove_modifier = purge_your_vassal
	}
}