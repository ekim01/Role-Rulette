import React from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LoadingScreen from "../../components/presentation/loadscreen";
import EndScreen from "../../components/EndScreen";

const filename = "EndScreen.js";

enzyme.configure({ adapter: new Adapter() });

/**************
 * RENDERING
 *************/

test(filename + " Renders loading screen on loading state", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  const wrapper = shallow(
    <EndScreen
      players={pList}
      errortext={""}
      loading={true}
    />
  );
  const instance = wrapper.instance();

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children).toContainEqual(
    <LoadingScreen text="Loading..." />
  );
});

test(
  filename + " Doesen't render loading screen on not loading state", () => {
    const pList = [{ user: "Hi", key: "121312312" }];
    const wrapper = shallow(
      <EndScreen
        players={pList}
        errortext={""}
        loading={false}
      />
    );
    const instance = wrapper.instance();

    const result = instance.render();

    expect(result.type).toBe("div");
    expect(result.props.children).not.toContainEqual(
      <LoadingScreen text="Loading..." />
    );
  }
);