In this area you can manage your **Tag Rules**.

**Rule groups** represent a set of rules where only 
the first matching rule will be executed.
All the rule groups defined will be executed.

Every rule will have a **trigger** that will define events and conditions to
execute a set of **Actions**.

The **Action Groups** containing a set of **Actions** are created within
an **Action Group Distribution**.

In an Action Group Distribution of type **None**
the actions within will be executed normally.

In an Action Group Distribution of type **Session** or **Page Load**
is possible to create Action Groups that will be executed with
a certain probability.

With type **Page Load** the distribution is determined on each page load,
while using type **Session** will lock the distribution until the session
expires.

All the actions within an **Action Groups** will be executed.