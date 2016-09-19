import React, {Component, PropTypes} from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {spacing, typography, zIndex} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';

const SelectableList = MakeSelectable(List);

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
  },
  version: {
    paddingLeft: spacing.desktopGutterLess,
    fontSize: 16,
  },
};

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
  };

  state = {
    'showPic': true
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  handleRequestChangeLink = (event, value) => {
    if (value) {
      window.location = value;
    }
  };

  togglePic = () => {
    this.setState({'showPic': !this.state.showPic});
  }


  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
    } = this.props;

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{zIndex: zIndex.drawer - 100}}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          网易云音乐神奇评论
        </div>

        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <ListItem primaryText="展示歌手图片" rightToggle={<Toggle toggled={this.state.showPic}
                    onToggle={this.togglePic}/>} />
          <ListItem primaryText="按评论数排序" value="/star" />
          <ListItem primaryText="随机获取" value="/random" />
        </SelectableList>
      </Drawer>
    );
  }
}

export default AppNavDrawer;
