import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date),
    );
  }

  @action loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finished loading activities", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    try {
      let activity = this.getActivity(id);
      if (activity) {
        this.activity = activity;
      } else {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);
        runInAction("loading activity", () => {
          this.activityRegistry.set(activity.id, activity);
          this.activity = activity;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finished loading activity", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finished creating activity", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true;
      await agent.Activities.update(activity);
      runInAction("updating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finished updating activity", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string,
  ) => {
    try {
      this.submitting = true;
      this.target = event.currentTarget.name;
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("finished deleting activity", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };
}

export default createContext(new ActivityStore());
