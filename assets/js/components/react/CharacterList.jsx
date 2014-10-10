/**
 * Character List Component
 */

define(['jquery', 'react', 'statistics'], function ($, React, statistics) {
	'use strict';
	
	var CharacterList = React.createClass({
		loadCharactersFromServer: function () {
			$.ajax({
				context: this,
				url: this.props.url,
				dataType: 'json',
				success: function (response) {
					if (response.success) {
						this.setState({ data: response.characters });
					} else {
						alert('error');
						console.log(response.err);
					}
				},
				error: function (xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}
 			});
		},
		getInitialState: function () {
			return { data: [] };
		},
		componentDidMount: function () {
			this.loadCharactersFromServer();
			setInterval(this.loadCharactersFromServer, this.props.pollInterval);
		},
		render: function () {
			var characterNodes = this.state.data.map(function (character) {
				character.health = statistics.getAdjusted(10, character.vitality);

				return (
					<div className="list-item">
						<div className="col-md-3">{character.name}</div>
						<div className="col-md-2">{character.charClass}</div>
						<div className="col-md-1">{character.strength}</div>
						<div className="col-md-1">{character.dexterity}</div>
						<div className="col-md-1">{character.vitality}</div>
						<div className="col-md-1">{character.intellect}</div>
						<div className="col-md-1">{character.health}</div>
						<div className="col-md-2">
							<div className="pull-right">
								<button className="btn btn-xs btn-primary" data-toggle="modal" data-target="#characterModal">
									<i className="glyphicon glyphicon-folder-open"></i>
								</button>
								<button className="btn btn-xs btn-danger">
									<i className="glyphicon glyphicon-trash"></i>
								</button>
							</div>
						</div>
					</div>
				);
			});

			return (
				<div id="charListContainer" className="characterList">
					<div className="list-head">
						<div className="col-md-3">Name</div>
						<div className="col-md-2">Class</div>
						<div className="col-md-1">Strength</div>
						<div className="col-md-1">Dexterity</div>
						<div className="col-md-1">Vitality</div>
						<div className="col-md-1">Intellect</div>
						<div className="col-md-1">Health</div>
						<div className="col-md-2"></div>
					</div>
					<div id="character-list" className="list-content">
						{characterNodes}
					</div>
				</div>
			);
		}
	});

	return CharacterList;
});