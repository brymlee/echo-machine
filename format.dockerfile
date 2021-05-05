FROM echo-machine:latest
COPY format format.sh
RUN chmod u+x format.sh
RUN /bin/bash format.sh
CMD ["/bin/bash"]
