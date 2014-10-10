/**
 * Character Creater Component
 */

define(['jquery', 'lodash', 'react', 'statistics'], function ($, _, React, statistics) {
	'use strict';

	var CharacterCreater = React.createClass({
		handleSubmit: function (e) {
			e.preventDefault();

			var newChar = {
				name: this.refs.name.getDOMNode().value,
				bio: this.refs.bio.getDOMNode().value,
				charClass: this.refs.charClass.getDOMNode().value,
				strength: this.refs.strength.getDOMNode().value,
				dexterity: this.refs.dexterity.getDOMNode().value,
				vitality: this.refs.vitality.getDOMNode().value,
				intellect: this.refs.intellect.getDOMNode().value
			};

			$.ajax({
				context: this,
				url: this.props.url,
				dataType: 'json',
				data: newChar,
				success: function (response) {
					if (response.success) {
						this.refs.name.getDOMNode().value = '';
						this.refs.bio.getDOMNode().value = '';
						this.refs.charClass.getDOMNode().value = '';
						this.refs.strength.getDOMNode().value = '';
						this.refs.dexterity.getDOMNode().value = '';
						this.refs.vitality.getDOMNode().value = '';
						this.refs.intellect.getDOMNode().value = '';
					} else {
						alert('error');
						console.log(response.err);
					}
				},
				error: function (xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}
 			});

			return;
		},
		handleClassChange: function (e) {
			var currClass = _.find(this.state.charClasses, function (charClass) {
					return charClass.name === this.refs.charClass.getDOMNode().value;
				}, this);

			this.refs.strength.getDOMNode().value = statistics.getClassBonus('strength', currClass, this.state.bonuses) + statistics.getDefaultStat();
			this.refs.dexterity.getDOMNode().value = statistics.getClassBonus('dexterity', currClass, this.state.bonuses) + statistics.getDefaultStat();
			this.refs.vitality.getDOMNode().value = statistics.getClassBonus('vitality', currClass, this.state.bonuses) + statistics.getDefaultStat();
			this.refs.intellect.getDOMNode().value = statistics.getClassBonus('intellect', currClass, this.state.bonuses) + statistics.getDefaultStat();

		},
		loadClassesFromServer: function () {
			$.ajax({
				context: this,
				url: '/static/classes',
				dataType: 'json',
				success: function (response) {
					if (response.success) {
						this.setState({ charClasses: response.classes, bonuses: response.bonuses });
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
			return { charClasses: [], bonuses: {} };
		},
		componentDidMount: function () {
			this.loadClassesFromServer();
		},
		render: function () {
			var classNodes = this.state.charClasses.map(function (charClass) {
				return (
					<option value={charClass.name}>{charClass.name}</option>
				);
			});

			return (
				<form role="form" onSubmit={this.handleSubmit}>

					<div className="form-group">
						<label for="newName">Character Name</label>
						<input type="text" id="newName" className="form-control" ref="name" />
					</div>
					<div className="form-group">
						<label for="newClass">Class</label>
						<select id="newClass" className="form-control" onChange={this.handleClassChange} ref="charClass">
							<option></option>
							{classNodes}
						</select>
					</div>

					<div className="row">
						<div className="col-sm-6">
							<div className="form-group">
								<label for="newStr">Strength</label>
								<input type="text" id="newStr" className="form-control" value="14" ref="strength" readOnly />
							</div>
							<div className="form-group">
								<label for="newVit">Vitality</label>
								<input type="text" id="newVit" className="form-control" value="14" ref="vitality" readOnly />
							</div>
						</div>
						<div className="col-sm-6">
							<div className="form-group">
								<label for="newDex">Dexterity</label>
								<input type="text" id="newDex" className="form-control" value="14" ref="dexterity" readOnly />
							</div>
							<div className="form-group">
								<label for="newInt">Intellect</label>
								<input type="text" id="newInt" className="form-control" value="14" ref="intellect" readOnly />
							</div>
						</div>
					</div>

					<div className="form-group">
						<label for="newBio">Biography</label>
						<textarea id="newBio" className="form-control" ref="bio"></textarea>
					</div>

					<div className="form-group">
						<button type="submit" className="form-control btn btn-primary">Create Character</button>
					</div>
				</form>
			);
		}
	});

	return CharacterCreater;
});